import React from 'react';
import IngredientsLabel from './IngredientsLabel';


export default function ProjectIngredients() {
  return <IngredientsLabel
    dataSets={<div><a target="_blank" rel="noopener noreferrer" href="http://www.image-net.org/">ImageNet</a></div>}
    preTrainedModels={<div><a target="_blank" rel="noopener noreferrer"  href="https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/2">MobileNet</a> by Google</div>}
    architectures={<div>Trainer.js by Kevin Robinson</div>}
    tunings={<div>Trainer.js by Kevin Robinson</div>}
  />;
}