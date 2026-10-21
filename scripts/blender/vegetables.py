"""
The vegetables a guinea pig loves, the bonus pickups of Guinea Run, built from
code in Blender.

    blender --background --factory-startup --python scripts/blender/vegetables.py -- \
        site-theme/javascripts/guinea-run/models/vegetables.glb [preview.png]

Each one is a top-level node named after it, about one unit tall, standing on
the floor and centred: fennel, carrot, bell-pepper, cucumber, romaine, parsley.
Flat glossy colours, no texture, a few hundred triangles each.
"""

import math
import sys

import bpy
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = ARGS[0] if ARGS else "vegetables.glb"
PREVIEW = ARGS[1] if len(ARGS) > 1 else None


def srgb(c):
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


MATS = {}


def mat(name, color, roughness=0.4, coat=0.5):
    if name not in MATS:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*srgb(color), 1)
        b.inputs["Roughness"].default_value = roughness
        if "Coat Weight" in b.inputs:
            b.inputs["Coat Weight"].default_value = coat
        MATS[name] = m
    return MATS[name]


def active():
    return bpy.context.view_layer.objects.active


def finish(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def sphere(loc, scale, material, segments=24, rings=14):
    bpy.ops.mesh.primitive_uv_sphere_add(location=loc, segments=segments, ring_count=rings)
    o = active()
    o.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    return finish(o, material)


def cone(loc, r1, r2, depth, material, rot=(0, 0, 0), vertices=20):
    bpy.ops.mesh.primitive_cone_add(location=loc, radius1=r1, radius2=r2, depth=depth, rotation=rot, vertices=vertices)
    return finish(active(), material)


def cyl(loc, radius, depth, material, rot=(0, 0, 0), vertices=16):
    bpy.ops.mesh.primitive_cylinder_add(location=loc, radius=radius, depth=depth, rotation=rot, vertices=vertices)
    return finish(active(), material)


def stalk(base, top, radius, material):
    """A cylinder from base to top: stems, fronds."""
    a, b = Vector(base), Vector(top)
    direction = b - a
    o = cyl((a + b) / 2, radius, direction.length, material, vertices=8)
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(direction.normalized())
    bpy.ops.object.transform_apply(rotation=True)
    return o


def leaf(loc, size, tilt, turn, material):
    """A flat curved leaf: a squashed sphere, tilted out from the stem."""
    o = sphere(loc, (size * 0.45, size * 0.08, size), material, 16, 10)
    o.rotation_euler = (tilt, 0, turn)
    bpy.ops.object.transform_apply(rotation=True)
    return o


def group(name, parts):
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    o = active()
    o.name = name
    o.data.name = name
    corners = [o.matrix_world @ Vector(c) for c in o.bound_box]
    cx = (min(v.x for v in corners) + max(v.x for v in corners)) / 2
    cy = (min(v.y for v in corners) + max(v.y for v in corners)) / 2
    bpy.context.scene.cursor.location = (cx, cy, min(v.z for v in corners))
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    o.location = (0, 0, 0)
    height = max(v.z for v in corners) - min(v.z for v in corners)
    o.scale = (1 / height,) * 3
    bpy.ops.object.transform_apply(scale=True)
    return o


GREEN = (0.35, 0.68, 0.22)
DARK_GREEN = (0.16, 0.45, 0.14)


def fennel():
    bulb = mat("fennel-bulb", (0.93, 0.95, 0.82), 0.35, 0.6)
    stem = mat("fennel-stem", (0.62, 0.82, 0.42))
    frond = mat("fennel-frond", (0.42, 0.72, 0.28), 0.6, 0.1)
    parts = [sphere((0, 0, 0.32), (0.36, 0.3, 0.32), bulb)]
    # Layers on the bulb, as a fennel has
    for x in (-0.16, 0.16):
        parts.append(sphere((x, -0.05, 0.3), (0.2, 0.24, 0.28), bulb))
    tops = []
    for i, (x, y) in enumerate([(-0.12, 0.02), (0, -0.04), (0.12, 0.02)]):
        top = (x * 1.8, y, 1.05 - abs(x) * 0.6)
        parts.append(stalk((x, y, 0.5), top, 0.05, stem))
        tops.append(top)
    # Feathery fronds: thin sprigs at the top of each stem
    for tx, ty, tz in tops:
        for k in range(5):
            angle = k / 5 * math.pi * 2
            parts.append(stalk((tx, ty, tz), (tx + math.cos(angle) * 0.16, ty + math.sin(angle) * 0.1, tz + 0.1 + (k % 2) * 0.06), 0.012, frond))
    return group("fennel", parts)


def carrot():
    root = mat("carrot", (0.98, 0.5, 0.1), 0.45, 0.4)
    top = mat("carrot-top", GREEN, 0.6, 0.1)
    # The point down, the shoulder up, rounded at the top
    parts = [cone((0, 0, 0.36), 0.03, 0.16, 0.72, root, (0, 0, 0), 20)]
    parts.append(sphere((0, 0, 0.72), (0.16, 0.16, 0.07), root))
    # A few faint rings, as a carrot has
    for z in (0.3, 0.46, 0.6):
        parts.append(cyl((0, 0, z), 0.03 + (z / 0.72) * 0.13 + 0.006, 0.01, mat("carrot-ring", (0.88, 0.42, 0.08)), vertices=20))
    for k in range(4):
        angle = (k - 1.5) * 0.35
        parts.append(leaf((math.sin(angle) * 0.08, 0, 0.92), 0.2, angle * 0.6, 0, top))
    return group("carrot", parts)


def bell_pepper():
    body = mat("pepper", (0.92, 0.12, 0.1), 0.2, 0.9)
    stem = mat("pepper-stem", DARK_GREEN, 0.5)
    parts = []
    for k in range(4):
        angle = k / 4 * math.pi * 2
        parts.append(sphere((math.cos(angle) * 0.1, math.sin(angle) * 0.1, 0.38), (0.27, 0.27, 0.36), body))
    parts.append(cyl((0, 0, 0.78), 0.06, 0.12, stem))
    parts.append(stalk((0, 0, 0.82), (0.05, 0, 0.98), 0.03, stem))
    return group("bell-pepper", parts)


def cucumber():
    skin = mat("cucumber", (0.18, 0.48, 0.16), 0.35, 0.6)
    flesh = mat("cucumber-flesh", (0.8, 0.92, 0.55), 0.4)
    seeds = mat("cucumber-seeds", (0.96, 0.98, 0.85), 0.4)
    # A slice standing up, as a guinea pig is given it: a disc, skin rim, seeds
    parts = [cyl((0, 0, 0.5), 0.5, 0.14, skin, (math.radians(90), 0, 0), 32)]
    parts.append(cyl((0, -0.005, 0.5), 0.44, 0.15, flesh, (math.radians(90), 0, 0), 32))
    for k in range(6):
        angle = k / 6 * math.pi * 2
        parts.append(sphere((math.cos(angle) * 0.17, -0.08, 0.5 + math.sin(angle) * 0.17), (0.04, 0.02, 0.06), seeds, 10, 6))
    return group("cucumber", parts)


def romaine():
    heart = mat("romaine", (0.55, 0.8, 0.3), 0.5, 0.2)
    outer = mat("romaine-outer", (0.3, 0.62, 0.2), 0.5, 0.2)
    rib = mat("romaine-rib", (0.86, 0.95, 0.68), 0.4)
    parts = []
    for k in range(7):
        angle = k / 7 * math.pi * 2
        r = 0.12
        parts.append(leaf((math.cos(angle) * r, math.sin(angle) * r, 0.5), 0.5, 0.25, -angle + math.pi / 2, outer if k % 2 else heart))
    parts.append(cyl((0, 0, 0.35), 0.1, 0.7, rib, vertices=12))
    return group("romaine", parts)


def parsley():
    stem = mat("parsley-stem", (0.45, 0.7, 0.28))
    leaves = mat("parsley", (0.2, 0.58, 0.18), 0.55, 0.1)
    parts = []
    for k in range(5):
        angle = (k - 2) * 0.28
        top = (math.sin(angle) * 0.4, (k % 2 - 0.5) * 0.1, 0.72 + (k % 2) * 0.1)
        parts.append(stalk((0, 0, 0), top, 0.02, stem))
        for j in range(3):
            a = j / 3 * math.pi * 2
            parts.append(sphere((top[0] + math.cos(a) * 0.08, top[1] + math.sin(a) * 0.05, top[2] + 0.05), (0.09, 0.07, 0.08), leaves, 12, 8))
    # The bunch is tied: a little band
    parts.append(cyl((0, 0, 0.18), 0.07, 0.06, mat("parsley-band", (0.98, 0.72, 0.2)), vertices=16))
    return group("parsley", parts)


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    items = [fennel(), carrot(), bell_pepper(), cucumber(), romaine(), parsley()]
    for i, item in enumerate(items):
        item.location = (i * 1.4, 0, 0)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=True, export_yup=True, export_apply=True)
    print("exported", OUT, len(items), "vegetables")
    if PREVIEW:
        scene = bpy.context.scene
        engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
        scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in engines else "BLENDER_EEVEE"
        scene.render.resolution_x, scene.render.resolution_y = 1200, 500
        world = bpy.data.worlds.new("World")
        world.use_nodes = True
        world.node_tree.nodes["Background"].inputs[0].default_value = (0.8, 0.9, 1, 1)
        scene.world = world
        bpy.ops.object.light_add(type="SUN", location=(3, -5, 8))
        active().data.energy = 3.5
        active().rotation_euler = (math.radians(40), math.radians(15), math.radians(25))
        bpy.ops.object.camera_add(location=(3.5, -9, 2.4))
        cam = active()
        cam.rotation_euler = (Vector((3.5, 0, 0.45)) - cam.location).to_track_quat("-Z", "Y").to_euler()
        cam.data.lens = 30
        scene.camera = cam
        scene.render.filepath = PREVIEW
        bpy.ops.render.render(write_still=True)
        print("preview", PREVIEW)


main()
