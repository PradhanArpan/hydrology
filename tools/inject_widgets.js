const fs = require('fs');
const path = require('path');

const widgetsFile = path.join(__dirname, '..', 'src', 'widgets.jsx');
const newWidgetsCode = fs.readFileSync(path.join(__dirname, 'new_widgets_code.jsx'), 'utf8');
let content = fs.readFileSync(widgetsFile, 'utf8');

// Check if already injected
if (content.includes('CropEtCalc')) {
  console.log('Widgets already injected.');
  process.exit(0);
}

// Target just before "export const WIDGETS = {"
const target = 'export const WIDGETS = {';
const newWidgetsMap = `  cropetcalc: CropEtCalc,
  "cropet-calc": CropEtCalc,
  fdcexplorer: FdcExplorer,
  "fdc-explorer": FdcExplorer,
  baseflowtool: BaseflowTool,
  "baseflow-tool": BaseflowTool,
  convolutionmatrix: ConvolutionMatrix,
  "convolution-matrix": ConvolutionMatrix,
  snydersynth: SnyderSynth,
  "snyder-synth": SnyderSynth,
  ratingcurvelab: RatingCurveLab,
  "rating-curve-lab": RatingCurveLab,
  looprating: LoopRating,
  "loop-rating": LoopRating,
  gumbelbench: GumbelBench,
  "gumbel-bench": GumbelBench,
  darcytube: DarcyTube,
  "darcy-tube": DarcyTube,
  rwhdesigner: RwhDesigner,
  "rwh-designer": RwhDesigner,\n`;

const replacement = newWidgetsCode + '\n' + target + '\n' + newWidgetsMap;

content = content.replace(target, replacement);

fs.writeFileSync(widgetsFile, content, 'utf8');
console.log('Successfully injected 10 new widgets into src/widgets.jsx!');
