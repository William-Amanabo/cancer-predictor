import * as tf from '@tensorflow/tfjs';
//import './Style.css';


console.log("this is tf",tf)

document.onload = start()


var classNames = [];
var model;

/*
load the class names 
*/
async function loadDict() {
  /* var loc = "dist/model/class_names.txt";
  console.log(loc);
  

  await fetch(loc, {
    method: "POST",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then((res) => success(res))
    .catch((err) => console.log(err)); */
    success();
}

/*
load the class names
*/
function success(data) {
  /* console.log("data from success",data)
  const lst = data.split(/\n/);
  for (var i = 0; i < lst.length - 1; i++) {
    let symbol = lst[i];
    classNames[i] = symbol;
    console.log(classNames);
  } */

  classNames = ["Cancerous Cells Absent","Cancerous Cells Present "];
}
/*
get the the class names 
*/
function getClassNames(indices) {
  var outp = [];
  for (var i = 0; i < indices.length; i++) outp[i] = classNames[indices[i]];
  console.log(outp);
  return outp;
}
/*
find predictions
*/
function findTopValues(inp, count) {
  var outp = [];
  let indices = findIndicesOfMax(inp, count);
  // show  scores
  for (var i = 0; i < indices.length; i++) outp[i] = inp[indices[i]];
  return outp;
}
/*
get indices of the top probs
*/
function findIndicesOfMax(inp, count) {
  var outp = [];
  for (var i = 0; i < inp.length; i++) {
    outp.push(i); // add index to output array
    if (outp.length > count) {
      outp.sort(function (a, b) {
        return inp[b] - inp[a];
      }); // descending sort the output array
      outp.pop(); // remove the last index (index of smallest element in output array)
    }
  }
  return outp;
}
function preprocess(img) {
  console.log('preprocess being called')
  //convert the image data to a tensor
  let tensor = tf.browser.fromPixels(img);
  //resize to 50 X 50
  const resized = tf.image.resizeBilinear(tensor, [50, 50]).toFloat();
  // Normalize the image
  const offset = tf.scalar(255.0);
  const normalized = tf.scalar(1.0).sub(resized.div(offset));
  //We add a dimension to get a batch shape
  const batched = normalized.expandDims(0);
  return batched;
}
/*
get the prediction 
*/
function predict(imgData) {
  var class_names = ["NO_IDC", "Contains_IDC"];
  //get the prediction
  var pred = model.predict(preprocess(imgData)).dataSync();
  console.log(pred);
  //retreive the highest probability class label
  const idx = tf.argMax(pred);

  //find the predictions
  var indices = findIndicesOfMax(pred, 1);
  console.log(indices);
  var probs = findTopValues(pred, 1);
  var names = getClassNames(indices);

  //set the table
  //setTable(names, probs)
  document.getElementById("Result").innerHTML = names;
  //document.getElementById("Probability").innerHTML = probs
  console.log(names);
  console.log(document.getElementById("Result"));
}

document.getElementById('Submit').addEventListener('click',()=>{
  console.log("Submit button clicked")
  start();
})
async function start() {
  //img = document.getElementById('image').files[0];
  console.log("model loading starting")
  model = await tf.loadLayersModel("model/model.json");

  console.log("model ", model)

  var status = document.getElementById("status");

  status.innerHTML = "Model Loaded";

  //document.getElementById('status').innerHTML = 'Model Loaded';

  var img = document.getElementById("list").firstElementChild.firstElementChild;
  console.log('image element', img)
  //model.predict(tf.zeros([null,50,50,3]))

  //load the class names
  await loadDict();
  predict(img);
}
