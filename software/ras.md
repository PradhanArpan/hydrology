## What HEC-RAS is

The **River Analysis System (HEC-RAS)**, also from the US Army Corps of Engineers' Hydrologic Engineering Center, computes how water **flows in rivers and over floodplains**: water-surface levels, velocities, flood extents and depths. Where HEC-HMS answers *how much water, and when?*, HEC-RAS answers *how high, how fast, and where does it go?*

It is free, and widely used for flood-plain mapping, bridge and culvert hydraulics, levee design and dam-break studies. HEC-RAS 6.x runs on **Windows only** — Mac and Linux users should use the department lab for Unit IV.

## What it computes

| Analysis | Use in CE633 |
| --- | --- |
| **1D steady flow** — water-surface profiles for given discharges (standard-step method with the energy equation and Manning's equation) | Slope–area discharge (Session 30); rating curves (Session 31) |
| **1D / 2D unsteady flow** — a flood hydrograph moving through the channel and floodplain (Saint-Venant equations) | Hydraulic vs hydrologic routing (Session 32); inundation maps (Session 36) |
| Sediment transport, water quality | Not in this course |

A 1D model describes the river by **cross-sections** surveyed across the channel and floodplain at intervals along the river, each with its bank stations and Manning's n values. **RAS Mapper** turns computed water levels into depth and extent maps on a terrain model.

::widget[rasconcept]

## How HEC-HMS and HEC-RAS work together

A common professional workflow, and the one we follow in Unit IV:

1. **HEC-HMS** turns a design storm into a **flood hydrograph** at the upstream end of a river reach.
2. **HEC-RAS** routes that hydrograph through the surveyed reach and computes **water levels and inundation**.
3. The results are checked against a gauged **rating curve** or observed high-water marks.

## Learn more

- HEC-RAS **User's Manual**, **Hydraulic Reference Manual** and **2D Modeling User's Manual** — online documentation on the HEC website (see [References](#/page/references)).
- Example projects: *Help › Install Example Projects* after installation.
