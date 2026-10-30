## What QGIS is

**QGIS** is a free and open-source **Geographic Information System**: software for viewing, editing and analysing data that has a location. In hydrology we use it to map rain gauges, draw Thiessen polygons, prepare DEMs, delineate catchments, compute areas and slopes, and make the maps that go into reports. It runs on Windows, macOS and Linux; use the **Long Term Release (LTR)**, which changes least during a semester.

## Two kinds of data

| | Vector | Raster |
| --- | --- | --- |
| Represents | Discrete features: points, lines, polygons | Continuous surfaces: a grid of cells, each with a value |
| Hydrology examples | Rain gauges (points), streams (lines), catchment boundary and Thiessen polygons (polygons) | DEM (elevation), rainfall grids, land-use maps, soil maps |
| Typical files | GeoPackage `.gpkg`, shapefile `.shp`, GeoJSON, CSV with coordinates | GeoTIFF `.tif` |
| Attributes | A table: one row per feature | One value per cell |

## Coordinate reference systems (CRS)

Every layer has a **CRS** that says how its coordinates relate to places on Earth.

- **Geographic** CRS (e.g. **EPSG:4326**, WGS 84): coordinates in degrees of latitude and longitude. GPS and most downloaded data use this.
- **Projected** CRS (e.g. **EPSG:32643**, WGS 84 / UTM zone 43N — the zone for Karnataka): coordinates in metres. **Areas, lengths and slopes must be computed in a projected CRS.**

A degree of longitude is about 111 km at the equator but about 108 km at Bengaluru's latitude, so an area computed in "square degrees" is meaningless. Reproject first, then measure.

## The window

::widget[qgistour]

## Tools we use in this course

| Task | Menu path | Lab |
| --- | --- | --- |
| Load points from a CSV | Layer › Add Layer › Add Delimited Text Layer | L09 |
| Reproject a layer | Vector › Data Management Tools › Reproject Layer | L09 |
| Thiessen (Voronoi) polygons | Vector › Geometry Tools › Voronoi Polygons | L09 |
| Clip one layer by another | Vector › Geoprocessing Tools › Clip | L09 |
| Compute area, weights | Attribute table › Field Calculator (`$area`) | L09 |
| Clip / reproject a DEM | Raster › Extraction › Clip Raster by Extent; Raster › Projections › Warp | L10 |
| Slope, hillshade | Raster › Analysis › Slope / Hillshade | Unit II |
| Print a map | Project › New Print Layout | L09 |

## Learn more

- QGIS **User Guide** and **Training Manual** — free online (see [References](#/page/references)).
- Open the **Processing Toolbox** and type what you want to do — most tools are found faster by search than by menu.
