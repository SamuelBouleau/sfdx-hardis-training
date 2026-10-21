"""
The guinea pig of Guinea Run, built from code in Blender, rigged and animated,
and exported as one glTF binary the game loads.

    blender --background --factory-startup --python scripts/blender/guinea-pig.py -- \
        site-theme/javascripts/guinea-run/models/guinea-pig.glb [preview.png]

Nothing here needs a texture: the coat is painted into vertex colours (ginger,
a white band, a black patch on the rump and round the right eye), the rest is
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


def material(name, color, roughness=0.6, metallic=0.0, vertex_colors=False, clearcoat=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(color), 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if clearcoat and "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = clearcoat
    if vertex_colors:
        attribute = mat.node_tree.nodes.new("ShaderNodeVertexColor")
        attribute.layer_name = "Coat"
        mat.node_tree.links.new(attribute.outputs["Color"], bsdf.inputs["Base Color"])
    return mat


def body_mesh():
    """Metaballs for a soft, round, pear-shaped body, turned into a mesh."""
    data = bpy.data.metaballs.new("BodyBalls")
    data.resolution = 0.045
    data.render_resolution = 0.045
    data.threshold = 0.6
    obj = bpy.data.objects.new("BodyBalls", data)
    bpy.context.collection.objects.link(obj)
    # x: right, y: forward is -Y (nose), z: up
    balls = [
        # rump, big and round
        ((0, 0.28, 0.36), 0.52, (1.0, 1.05, 0.9)),
        # middle of the body
        ((0, -0.02, 0.36), 0.5, (0.95, 1.0, 0.86)),
        # shoulders, a bit narrower
        ((0, -0.3, 0.37), 0.42, (0.9, 1.0, 0.86)),
        # head, low and forward, the nose dipping
        ((0, -0.6, 0.36), 0.34, (0.9, 1.05, 0.88)),
        # muzzle
        ((0, -0.8, 0.31), 0.2, (0.95, 1.0, 0.85)),
        # cheeks
        ((0.17, -0.66, 0.3), 0.16, (1, 1, 1)),
        ((-0.17, -0.66, 0.3), 0.16, (1, 1, 1)),
    ]
    for (x, y, z), radius, (sx, sy, sz) in balls:
        element = data.elements.new()
        element.co = (x, y, z)
        element.radius = radius
        element.type = "ELLIPSOID"
        element.size_x, element.size_y, element.size_z = radius * sx, radius * sy, radius * sz
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    mesh = bpy.context.view_layer.objects.active
    mesh.name = "Body"
    # A flat belly: everything under the floor line is pressed up
    for v in mesh.data.vertices:
        if v.co.z < 0.08:
            v.co.z = 0.08 + (v.co.z - 0.08) * 0.25
    bpy.ops.object.shade_smooth()
    decimate = mesh.modifiers.new("Decimate", "DECIMATE")
    decimate.ratio = 0.5
    bpy.ops.object.modifier_apply(modifier="Decimate")
    smooth = mesh.modifiers.new("Smooth", "SMOOTH")
    smooth.iterations = 4
    smooth.factor = 0.5
    bpy.ops.object.modifier_apply(modifier="Smooth")
    return mesh


def paint_coat(mesh):
    """Ginger all over, a white band and blaze, black on the rump and the right eye."""
    attribute = mesh.data.color_attributes.new("Coat", "FLOAT_COLOR", "POINT")
    for v in mesh.data.vertices:
        x, y, z = v.co
        color = GINGER
        # Lighter under the belly
        if z < 0.2:
            color = tuple(c * 0.85 + w * 0.15 for c, w in zip(GINGER, WHITE))
        # The white band round the middle, with a wavy edge
        if -0.12 + 0.03 * math.sin(x * 9) < y < 0.1 + 0.03 * math.sin(x * 7 + 1):
            color = WHITE
        # The white blaze down the face
        if y < -0.5 and abs(x) < 0.07 + (-0.5 - y) * 0.25 and z > 0.3:
            color = WHITE
        # The muzzle is white too
        if y < -0.82:
            color = WHITE
        # Black patch on the left of the rump
        if (x + 0.18) ** 2 / 0.09 + (y - 0.36) ** 2 / 0.06 + (z - 0.5) ** 2 / 0.12 < 1:
            color = BLACK
        # Black round the right eye
        if (x - 0.2) ** 2 + (y + 0.62) ** 2 / 1.4 + (z - 0.46) ** 2 < 0.014:
            color = BLACK
        # A little darker on the back, as fur is
        if z > 0.6 and color == GINGER:
            color = tuple(c * 0.8 + d * 0.2 for c, d in zip(GINGER, GINGER_DARK))
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


def details(mats):
    parts = []
    # Eyes: glossy black, a little bulging, on the sides of the head
    for side in (1, -1):
        eye = add("uv_sphere", "Eye" + ("R" if side > 0 else "L"), (0.22 * side, -0.66, 0.47), (0.065, 0.075, 0.075), mat=mats["eye"], segments=20, ring_count=12)
        parts.append(eye)
        shine = add("uv_sphere", "Shine" + ("R" if side > 0 else "L"), (0.26 * side, -0.7, 0.51), (0.018, 0.018, 0.018), mat=mats["shine"], segments=10, ring_count=6)
        parts.append(shine)
    # Ears: petals, pink inside, folded back a little
    for side in (1, -1):
        ear = add("uv_sphere", "Ear" + ("R" if side > 0 else "L"), (0.2 * side, -0.48, 0.63), (0.1, 0.035, 0.08), (math.radians(-20), math.radians(25 * side), 0), mat=mats["ear"], segments=16, ring_count=10)
        parts.append(ear)
    # Nose and mouth
    parts.append(add("uv_sphere", "Nose", (0, -0.98, 0.36), (0.045, 0.03, 0.03), mat=mats["nose"], segments=12, ring_count=8))
    # Feet: four pink ovals poking out
    for name, (x, y) in {"FootFL": (0.17, -0.42), "FootFR": (-0.17, -0.42), "FootBL": (0.21, 0.36), "FootBR": (-0.21, 0.36)}.items():
        parts.append(add("uv_sphere", name, (x, y, 0.05), (0.07, 0.1, 0.045), mat=mats["foot"], segments=14, ring_count=8))
    # Whiskers: thin, light, three a side
    for side in (1, -1):
        for i in range(3):
            angle = math.radians(-12 + i * 12)
            whisker = add(
                "cylinder",
                "Whisker",
                (0.17 * side, -0.9, 0.34 + i * 0.015),
                (0.004, 0.004, 0.17),
                (0, math.radians(90), math.radians(-90 * side) + side * angle),
                mat=mats["whisker"],
                vertices=5,
            )
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
    bone("body", (0, 0.3, 0.36), (0, -0.3, 0.38), "root")
    bone("head", (0, -0.36, 0.38), (0, -0.92, 0.36), "body")
    bone("ear.L", (0.18, -0.48, 0.58), (0.22, -0.44, 0.7), "head")
    bone("ear.R", (-0.18, -0.48, 0.58), (-0.22, -0.44, 0.7), "head")
    bone("leg.FL", (0.17, -0.42, 0.24), (0.17, -0.42, 0.02), "body")
    bone("leg.FR", (-0.17, -0.42, 0.24), (-0.17, -0.42, 0.02), "body")
    bone("leg.BL", (0.21, 0.36, 0.24), (0.21, 0.36, 0.02), "body")
    bone("leg.BR", (-0.21, 0.36, 0.24), (-0.21, 0.36, 0.02), "body")
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
        0: pose(root=(Z, Z), body=((0, 0, 0.06), (28, 0, 0)), head=(Z, (-12, 0, 0)),
                **{"leg.FL": (Z, (-30, 0, 0)), "leg.FR": (Z, (-30, 0, 0)), "leg.BL": (Z, (-28, 0, 0)), "leg.BR": (Z, (-28, 0, 0))}),
        40: pose(root=(Z, Z), body=((0, 0, 0.07), (30, 0, 0), (1.02, 1, 1.02)), head=(Z, (-16, 0, 4)),
                 **{"leg.FL": (Z, (-36, 0, 0)), "leg.FR": (Z, (-26, 0, 0)), "leg.BL": (Z, (-28, 0, 0)), "leg.BR": (Z, (-28, 0, 0))}),
        80: pose(root=(Z, Z), body=((0, 0, 0.06), (28, 0, 0)), head=(Z, (-12, 0, 0)),
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
    direction = Vector((0, -0.2, 0.32)) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = 50
    scene.camera = camera
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    reset()
    mats = {
        "coat": material("Coat", GINGER, 0.85, vertex_colors=True),
        "eye": material("Eye", (0.02, 0.02, 0.03), 0.05, clearcoat=1.0),
        "shine": material("Shine", (1, 1, 1), 0.2),
        "ear": material("Ear", PINK, 0.7),
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
