"""
The guinea pig of Guinea Run, built from code in Blender, rigged and animated,
and exported as one glTF binary the game loads.

    blender --background --factory-startup --python scripts/blender/guinea-pig.py -- \
        site-theme/javascripts/guinea-run/models/guinea-pig.glb [preview.png]

Nothing here needs a texture: the coat is painted into vertex colours (ginger,
a white band and blaze, a black patch on the rump), the rest is
flat materials. The model faces -Y in Blender, which the glTF exporter turns
into -Z, the way the game's guinea pig has always looked down its track.

Bones: root, body, head, ear.L, ear.R, leg.FL, leg.FR, leg.BL, leg.BR.
Actions (glTF animations): idle, run, jump, sit, happy, hit.
"""

import math
import sys

import bpy
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = ARGS[0] if ARGS else "guinea-pig.glb"
PREVIEW = ARGS[1] if len(ARGS) > 1 else None

GINGER = (0.76, 0.42, 0.17)
GINGER_DARK = (0.55, 0.28, 0.1)
WHITE = (0.95, 0.92, 0.87)
BLACK = (0.14, 0.1, 0.08)
PINK = (0.93, 0.62, 0.6)
PINK_DEEP = (0.85, 0.45, 0.47)
FPS = 30


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.render.fps = FPS


def srgb_to_linear(c):
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def material(name, color, roughness=0.6, metallic=0.0, vertex_colors=False, clearcoat=0.0, sheen=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(color), 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if sheen and "Sheen Weight" in bsdf.inputs:
        bsdf.inputs["Sheen Weight"].default_value = sheen
        bsdf.inputs["Sheen Tint"].default_value = (1, 0.92, 0.85, 1)
    if clearcoat and "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = clearcoat
    if vertex_colors:
        attribute = mat.node_tree.nodes.new("ShaderNodeVertexColor")
        attribute.layer_name = "Coat"
        mat.node_tree.links.new(attribute.outputs["Color"], bsdf.inputs["Base Color"])
    return mat


# The side profile, rump (s < 0) to nose (s > 0): (s, radius). The same
# silhouette the game drew before, now on a dense, smooth mesh.
PROFILE = [
    (-0.62, 0.0), (-0.6, 0.17), (-0.54, 0.31), (-0.44, 0.41), (-0.3, 0.46), (-0.1, 0.48),
    (0.1, 0.46), (0.28, 0.415), (0.42, 0.36), (0.54, 0.315), (0.64, 0.255), (0.72, 0.175),
    (0.77, 0.085), (0.785, 0.0),
]
AXIS = 0.42  # height of the body's axis above the floor


def profile(s):
    """Catmull-Rom through PROFILE, so the outline has no corners."""
    pts = PROFILE
    if s <= pts[0][0] or s >= pts[-1][0]:
        return 0.0
    for i in range(len(pts) - 1):
        if pts[i][0] <= s <= pts[i + 1][0]:
            p0 = pts[max(i - 1, 0)][1]
            p1 = pts[i][1]
            p2 = pts[i + 1][1]
            p3 = pts[min(i + 2, len(pts) - 1)][1]
            t = (s - pts[i][0]) / (pts[i + 1][0] - pts[i][0])
            return max(0.0, 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    return 0.0


def smooth(edge0, edge1, x):
    t = min(max((x - edge0) / (edge1 - edge0), 0.0), 1.0)
    return t * t * (3 - 2 * t)


def body_mesh():
    """A dense sphere wrapped onto the profile: round rump, tapered head, flat belly."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=48, radius=1)
    mesh = bpy.context.view_layer.objects.active
    mesh.name = "Body"
    for v in mesh.data.vertices:
        x, y, z = v.co
        # z from -1 (rump pole) to 1 (nose pole) becomes the axial position s
        s = -0.62 + (z + 1) / 2 * (0.785 + 0.62)
        ring = math.hypot(x, y)
        dx, dy = (x / ring, y / ring) if ring > 1e-6 else (0.0, 0.0)
        r = profile(s)
        X = dx * r * 1.03
        up = dy * r
        # A flat belly and a slightly narrower back
        up *= 0.62 if up < 0 else 0.9
        # The rump sits a little higher, the nose dips; cheeks fill the head
        up += 0.05 * smooth(0, 0.6, -s)
        up -= 0.09 * smooth(0.45, 0.8, s)
        X *= 1 + 0.1 * smooth(0.35, 0.55, s) * (1 - smooth(0.62, 0.76, s))
        v.co = (X, -s, AXIS + up)
    bpy.ops.object.shade_smooth()
    return mesh


def mix(a, b, t):
    return tuple(x + (y - x) * t for x, y in zip(a, b))


def band(value, low, high, soft):
    """1 inside [low, high], fading to 0 over soft on both sides."""
    return smooth(low - soft, low + soft, value) * (1 - smooth(high - soft, high + soft, value))


def blob(distance, soft=0.25):
    """1 at the centre of an ellipse (distance 0), 0 outside (distance 1), soft edge."""
    return 1 - smooth(1 - soft, 1 + soft * 0.5, distance)


def paint_coat(mesh):
    """Ginger all over, a white band and blaze, black on the rump. Every edge is
    a soft blend, so the coat has no steps."""
    attribute = mesh.data.color_attributes.new("Coat", "FLOAT_COLOR", "POINT")
    for v in mesh.data.vertices:
        x, y, z = v.co
        s = -y
        h = z - AXIS
        color = GINGER
        # Lighter under the belly, darker along the back
        color = mix(color, WHITE, 0.22 * (1 - smooth(-0.2, -0.05, h)))
        color = mix(color, GINGER_DARK, 0.3 * smooth(0.25, 0.42, h))
        # The white band round the middle, with a wavy edge
        color = mix(color, WHITE, band(s + 0.02 * math.sin(x * 9 + h * 6), -0.1, 0.12, 0.03))
        # The white blaze down the face, then the whole muzzle
        blaze = band(x, -(0.05 + (s - 0.45) * 0.35), 0.05 + (s - 0.45) * 0.35, 0.025) * smooth(0.42, 0.5, s) * smooth(-0.12, -0.02, h)
        color = mix(color, WHITE, max(blaze, smooth(0.66, 0.72, s)))
        # Black on the left of the rump
        rump = math.sqrt((x + 0.2) ** 2 / 0.07 + (s + 0.38) ** 2 / 0.05 + (h - 0.12) ** 2 / 0.1)
        color = mix(color, BLACK, blob(rump) * (1 if x < 0.1 else 0))
        grain = 1 + 0.06 * (math.sin(x * 91 + s * 57) * math.sin(h * 73 - x * 31))
        color = tuple(min(1.0, c * grain) for c in color)
        attribute.data[v.index].color = (*srgb_to_linear(color), 1)


def add(primitive, name, location, scale=(1, 1, 1), rotation=(0, 0, 0), mat=None, **kwargs):
    getattr(bpy.ops.mesh, "primitive_" + primitive + "_add")(location=location, rotation=rotation, **kwargs)
    obj = bpy.context.view_layer.objects.active
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if mat:
        obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def surface(s, side, lift):
    """A point on the body at axial position s, on one side, lift above the axis."""
    r = profile(s)
    return Vector((side * math.sqrt(max(r * r - lift * lift, 0)) * 1.03, -s, AXIS + lift - 0.09 * smooth(0.45, 0.8, s)))


def details(mats):
    parts = []
    # Eyes: glossy black, a little bulging, on the sides of the head
    for side in (1, -1):
        p = surface(0.52, side, 0.1)
        eye = add("uv_sphere", "Eye" + ("R" if side > 0 else "L"), (p.x * 0.96, p.y, p.z), (0.06, 0.07, 0.07), mat=mats["eye"], segments=20, ring_count=12)
        parts.append(eye)
        shine = add("uv_sphere", "Shine" + ("R" if side > 0 else "L"), (p.x * 1.04, p.y - 0.035, p.z + 0.035), (0.016, 0.016, 0.016), mat=mats["shine"], segments=10, ring_count=6)
        parts.append(shine)
    # Ears: drooping petals on top of the head, ginger outside, pink inside
    for side in (1, -1):
        p = surface(0.38, side, 0.22)
        tilt = (math.radians(-10), math.radians(-25 * side), math.radians(28 * side))
        outer = add("uv_sphere", "Ear" + ("R" if side > 0 else "L"), (p.x * 1.0, p.y + 0.03, p.z + 0.08), (0.022, 0.1, 0.09), tilt, mat=mats["earOuter"], segments=18, ring_count=12)
        parts.append(outer)
        inner = add("uv_sphere", "Ear" + ("R" if side > 0 else "L") + "In", (p.x * 1.0 + side * 0.013, p.y + 0.03, p.z + 0.08), (0.01, 0.08, 0.07), tilt, mat=mats["ear"], segments=16, ring_count=10)
        parts.append(inner)
    # Nose, at the tip of the muzzle
    tip = surface(0.77, 1, 0.0)
    parts.append(add("uv_sphere", "Nose", (0, tip.y + 0.005, tip.z + 0.02), (0.04, 0.03, 0.03), mat=mats["nose"], segments=12, ring_count=8))
    # Feet: four pink ovals poking out under the body
    for name, (x, s) in {"FootFL": (0.17, 0.36), "FootFR": (-0.17, 0.36), "FootBL": (0.21, -0.36), "FootBR": (-0.21, -0.36)}.items():
        parts.append(add("uv_sphere", name, (x, -s, 0.035), (0.065, 0.095, 0.04), mat=mats["foot"], segments=14, ring_count=8))
    # Whiskers: thin, light, three a side, from the muzzle outwards
    for side in (1, -1):
        root = surface(0.7, side, -0.02)
        for i in range(3):
            angle = math.radians(-14 + i * 14)
            length = 0.2
            direction = Vector((side * math.cos(angle), -0.25, math.sin(angle) * 0.6)).normalized()
            centre = root + direction * (length / 2)
            whisker = add("cylinder", "Whisker", centre, (0.004, 0.004, length / 2), mat=mats["whisker"], vertices=5)
            whisker.rotation_mode = "QUATERNION"
            whisker.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(direction)
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
            parts.append(whisker)
    return parts


def armature():
    data = bpy.data.armatures.new("Rig")
    rig = bpy.data.objects.new("Rig", data)
    bpy.context.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="EDIT")
    bones = {}

    def bone(name, head, tail, parent=None):
        b = data.edit_bones.new(name)
        b.head, b.tail = head, tail
        if parent:
            b.parent = bones[parent]
        bones[name] = b

    bone("root", (0, 0, 0), (0, 0, 0.12))
    bone("body", (0, 0.45, AXIS), (0, -0.3, AXIS), "root")
    bone("head", (0, -0.3, AXIS), (0, -0.8, AXIS - 0.05), "body")
    bone("ear.L", (0.17, -0.36, AXIS + 0.22), (0.2, -0.32, AXIS + 0.34), "head")
    bone("ear.R", (-0.17, -0.36, AXIS + 0.22), (-0.2, -0.32, AXIS + 0.34), "head")
    bone("leg.FL", (0.17, -0.36, 0.22), (0.17, -0.36, 0.0), "body")
    bone("leg.FR", (-0.17, -0.36, 0.22), (-0.17, -0.36, 0.0), "body")
    bone("leg.BL", (0.21, 0.36, 0.22), (0.21, 0.36, 0.0), "body")
    bone("leg.BR", (-0.21, 0.36, 0.22), (-0.21, 0.36, 0.0), "body")
    bpy.ops.object.mode_set(mode="OBJECT")
    return rig


def bind(rig, body, parts):
    """The body gets automatic weights; each small part follows one bone."""
    follow = {
        "Eye": "head", "Shine": "head", "Nose": "head", "Whisker": "head",
        "EarR": "ear.R", "EarL": "ear.L",
        "FootFL": "leg.FL", "FootFR": "leg.FR", "FootBL": "leg.BL", "FootBR": "leg.BR",
    }
    bpy.ops.object.select_all(action="DESELECT")
    body.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")
    for part in parts:
        key = next((k for k in follow if part.name.startswith(k)), None)
        group = part.vertex_groups.new(name=follow[key])
        group.add([v.index for v in part.data.vertices], 1.0, "REPLACE")
        modifier = part.modifiers.new("Rig", "ARMATURE")
        modifier.object = rig
        part.parent = rig


def keys(rig, action_name, frames, length, loop=True):
    """frames: {frame: {bone: (location, rotation_euler_degrees, scale)}}"""
    action = bpy.data.actions.new(action_name)
    rig.animation_data_create()
    rig.animation_data.action = action
    for pose_bone in rig.pose.bones:
        pose_bone.rotation_mode = "XYZ"
    for frame, pose in sorted(frames.items()):
        for name, (loc, rot, scale) in pose.items():
            pb = rig.pose.bones[name]
            pb.location = loc
            pb.rotation_euler = [math.radians(a) for a in rot]
            pb.scale = scale
            pb.keyframe_insert("location", frame=frame)
            pb.keyframe_insert("rotation_euler", frame=frame)
            pb.keyframe_insert("scale", frame=frame)
    action.frame_range = (0, length)
    action.use_frame_range = True
    # Park it on the NLA, so the exporter writes one animation per action
    track = rig.animation_data.nla_tracks.new()
    track.name = action_name
    strip = track.strips.new(action_name, 0, action)
    strip.name = action_name
    rig.animation_data.action = None
    for pb in rig.pose.bones:
        pb.location = (0, 0, 0)
        pb.rotation_euler = (0, 0, 0)
        pb.scale = (1, 1, 1)
    return action


Z = (0, 0, 0)
ONE = (1, 1, 1)


def pose(**bones):
    return {name: (value[0], value[1], value[2] if len(value) > 2 else ONE) for name, value in bones.items()}


def animations(rig):
    # Bone-local axes: Blender bones point along their Y. For "body" (pointing
    # forward) a rotation round X nods the whole body; for legs round X swings them.
    keys(rig, "idle", {
        0: pose(body=(Z, Z, ONE), head=(Z, Z), **{"ear.L": (Z, Z), "ear.R": (Z, Z)}),
        30: pose(body=(Z, Z, (1.03, 1.0, 1.03)), head=(Z, (4, 0, 0)), **{"ear.L": (Z, (0, 0, 12)), "ear.R": (Z, Z)}),
        45: pose(body=(Z, Z, ONE), head=(Z, (0, 0, -6)), **{"ear.L": (Z, Z), "ear.R": (Z, (0, 0, -10))}),
        60: pose(body=(Z, Z, ONE), head=(Z, Z), **{"ear.L": (Z, Z), "ear.R": (Z, Z)}),
    }, 60)
    # A gallop: back legs push together, front legs land together, the body
    # stretches and gathers, and bobs
    keys(rig, "run", {
        0: pose(root=(Z, Z), body=((0, 0, 0), (6, 0, 0), (1, 1.06, 0.97)), head=(Z, (-6, 0, 0)),
                **{"leg.FL": (Z, (-45, 0, 0)), "leg.FR": (Z, (-40, 0, 0)), "leg.BL": (Z, (40, 0, 0)), "leg.BR": (Z, (45, 0, 0)), "ear.L": (Z, (-15, 0, 0)), "ear.R": (Z, (-15, 0, 0))}),
        5: pose(root=((0, 0, 0.09), Z), body=((0, 0, 0), (-4, 0, 0), (1, 0.94, 1.04)), head=(Z, (4, 0, 0)),
                **{"leg.FL": (Z, (35, 0, 0)), "leg.FR": (Z, (30, 0, 0)), "leg.BL": (Z, (-35, 0, 0)), "leg.BR": (Z, (-30, 0, 0)), "ear.L": (Z, (10, 0, 0)), "ear.R": (Z, (10, 0, 0))}),
        10: pose(root=(Z, Z), body=((0, 0, 0), (6, 0, 0), (1, 1.06, 0.97)), head=(Z, (-6, 0, 0)),
                 **{"leg.FL": (Z, (-45, 0, 0)), "leg.FR": (Z, (-40, 0, 0)), "leg.BL": (Z, (40, 0, 0)), "leg.BR": (Z, (45, 0, 0)), "ear.L": (Z, (-15, 0, 0)), "ear.R": (Z, (-15, 0, 0))}),
    }, 10)
    # In the air: stretched long, legs tucked
    keys(rig, "jump", {
        0: pose(body=(Z, (-10, 0, 0), (0.95, 1.12, 0.95)), head=(Z, (8, 0, 0)),
                **{"leg.FL": (Z, (-50, 0, 0)), "leg.FR": (Z, (-50, 0, 0)), "leg.BL": (Z, (50, 0, 0)), "leg.BR": (Z, (50, 0, 0)), "ear.L": (Z, (-30, 0, 0)), "ear.R": (Z, (-30, 0, 0))}),
        12: pose(body=(Z, (6, 0, 0), (1.02, 1.04, 0.98)), head=(Z, (-4, 0, 0)),
                 **{"leg.FL": (Z, (20, 0, 0)), "leg.FR": (Z, (20, 0, 0)), "leg.BL": (Z, (-15, 0, 0)), "leg.BR": (Z, (-15, 0, 0)), "ear.L": (Z, (20, 0, 0)), "ear.R": (Z, (20, 0, 0))}),
    }, 12, loop=False)
    # Up on its back legs, nose high, front paws off the ground
    keys(rig, "sit", {
        0: pose(root=((0, 0, -0.08), Z), body=((0, 0, 0.0), (28, 0, 0)), head=(Z, (-12, 0, 0)),
                **{"leg.FL": (Z, (-30, 0, 0)), "leg.FR": (Z, (-30, 0, 0)), "leg.BL": (Z, (-28, 0, 0)), "leg.BR": (Z, (-28, 0, 0))}),
        40: pose(root=((0, 0, -0.08), Z), body=((0, 0, 0.01), (30, 0, 0), (1.02, 1, 1.02)), head=(Z, (-16, 0, 4)),
                 **{"leg.FL": (Z, (-36, 0, 0)), "leg.FR": (Z, (-26, 0, 0)), "leg.BL": (Z, (-28, 0, 0)), "leg.BR": (Z, (-28, 0, 0))}),
        80: pose(root=((0, 0, -0.08), Z), body=((0, 0, 0.0), (28, 0, 0)), head=(Z, (-12, 0, 0)),
                 **{"leg.FL": (Z, (-30, 0, 0)), "leg.FR": (Z, (-30, 0, 0)), "leg.BL": (Z, (-28, 0, 0)), "leg.BR": (Z, (-28, 0, 0))}),
    }, 80)
    # Popcorning: the happy hop of a guinea pig, with a twist in the air
    keys(rig, "happy", {
        0: pose(root=(Z, Z), body=(Z, Z, (1.06, 0.95, 0.9))),
        6: pose(root=((0, 0, 0.45), (0, 0, 25)), body=(Z, (-8, 10, 0), (0.95, 1.08, 1.06)),
                **{"leg.FL": (Z, (-30, 0, 0)), "leg.FR": (Z, (-30, 0, 0)), "leg.BL": (Z, (40, 0, 0)), "leg.BR": (Z, (40, 0, 0)), "ear.L": (Z, (-30, 0, 20)), "ear.R": (Z, (-30, 0, -20))}),
        12: pose(root=((0, 0, 0.3), (0, 0, -20)), body=(Z, (6, -10, 0))),
        18: pose(root=(Z, Z), body=(Z, Z, (1.08, 0.94, 0.88))),
        24: pose(root=(Z, Z), body=(Z, Z, ONE)),
    }, 24, loop=False)
    # Hit: squashed, shaken, ears back
    keys(rig, "hit", {
        0: pose(body=(Z, Z, (1.15, 0.9, 0.8)), head=(Z, (10, 0, 0)), **{"ear.L": (Z, (-40, 0, 0)), "ear.R": (Z, (-40, 0, 0))}),
        4: pose(body=(Z, (0, 12, 0), (0.95, 1.05, 1.05))),
        8: pose(body=(Z, (0, -10, 0), (1.04, 0.98, 0.97))),
        12: pose(body=(Z, (0, 5, 0), ONE)),
        16: pose(body=(Z, Z, ONE), head=(Z, Z), **{"ear.L": (Z, Z), "ear.R": (Z, Z)}),
    }, 16, loop=False)


def preview(path):
    """A quick studio render, to look at the model without the game."""
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items] else "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 960, 640
    scene.render.film_transparent = False
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.75, 0.88, 1, 1)
    scene.world = world
    bpy.ops.object.light_add(type="SUN", location=(3, -3, 5))
    sun = bpy.context.view_layer.objects.active
    sun.data.energy = 4
    sun.rotation_euler = (math.radians(45), math.radians(10), math.radians(35))
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
    floor = bpy.context.view_layer.objects.active
    floor.data.materials.append(material("Floor", (0.8, 0.9, 0.95), 0.9))
    bpy.ops.object.camera_add(location=(2.1, -2.3, 1.25))
    camera = bpy.context.view_layer.objects.active
    direction = Vector((0, -0.1, 0.36)) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = 50
    scene.camera = camera
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    reset()
    mats = {
        "coat": material("Coat", GINGER, 0.8, vertex_colors=True, sheen=0.6),
        "eye": material("Eye", (0.02, 0.02, 0.03), 0.05, clearcoat=1.0),
        "shine": material("Shine", (1, 1, 1), 0.2),
        "ear": material("Ear", PINK, 0.7),
        "earOuter": material("EarOuter", (0.72, 0.42, 0.24), 0.8),
        "nose": material("Nose", PINK_DEEP, 0.5),
        "foot": material("Foot", PINK, 0.7),
        "whisker": material("Whisker", (0.95, 0.93, 0.9), 0.5),
    }
    body = body_mesh()
    paint_coat(body)
    body.data.materials.append(mats["coat"])
    parts = details(mats)
    rig = armature()
    bind(rig, body, parts)
    animations(rig)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=OUT,
        export_format="GLB",
        use_selection=True,
        export_animations=True,
        export_animation_mode="NLA_TRACKS",
        export_skins=True,
        export_apply=False,
        export_yup=True,
        export_vertex_color="ACTIVE",
    )
    print("exported", OUT)
    if PREVIEW:
        preview(PREVIEW)
        print("preview", PREVIEW)


main()
