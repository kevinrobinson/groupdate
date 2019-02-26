// // from https://beta.observablehq.com/@nsthorat/how-to-build-a-teachable-machine-with-tensorflow-js
// async function drawChart(tensor, endpoint = 'conv_preds', domain = null, title = "logits") {
//   const y = mobilenet.infer(tensor, endpoint);
//   tensor.dispose();
//   const result = Array.from(await y.data());
//   y.dispose();
  
//   const data = result.map((x, i) => {return {imagenetClassId: i, value: x, className: imagenetClasses[i]}})
    
//   const def = {
//     "title": title,
//     "data": {values: data},
//     "mark": "bar",
//     "height": 100,
//     "width": width,
//     "encoding": {
//       "x": {
//         "field": "imagenetClassId",
//         "type": "ordinal"
//       },
//       "y": {
//         "field": "value",
//         "type": "quantitative",
//         "axis": {title: null}
//       },
//       "tooltip": {"field": "className"}
//     },

//   };
//   if (domain != null) {
//     def['encoding']['y']['scale'] = {"domain": domain};
//   }
  
//   const pointerEl = pointer();
//   const chart = vegalite(def);
//   const div = document.createElement('div');
//   div.appendChild(pointerEl);
//   div.appendChild(chart);
//   return div;
// }

// module.exports = {drawChart};
