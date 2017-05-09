const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.src = window.URL.createObjectURL(localMediaStream)
            video.play()
        }).catch(err => {
            console.error('You need to allow access to your webcam. ', err)
        })
}

function paintToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        // take pixles out
        let pixles = ctx.getImageData(0,0,width,height)
        // alter the pixels
        pixles = redEffect(pixles)
        // pixles = rgbSplit(pixles)
        // then put the pixles back
        ctx.putImageData(pixles,0,0)
    }, 16)
}

function takePhoto() {
    snap.currentTime = 0
    snap.play()

    // create an image
    const data = canvas.toDataURL('image.jepg')
    
    const link = document.createElement('a')
    link.href = data
    link.setAttribute('download', 'photo')
    link.innerHTML = `<img src=${data} alt="web cam photo"/>`
    strip.insertBefore(link, strip.firstChild)
}


// filters 
function redEffect(pixles) {
    for(let i = 0; i < pixles.data.length; i += 4) {
        pixles.data[i] = pixles.data[i] + 100 //red 
        pixles.data[i + 1] = pixles.data[i + 1] - 50 // green 
        pixles.data[i + 2] = pixles.data[i + 2] * 0.5 //blue
    }
    return pixles
}

function rgbSplit(pixles) {
    for(let i = 0; i < pixles.data.length; i += 4) {
        pixles.data[i - 150] = pixles.data[i]//red 
        pixles.data[i + 100] = pixles.data[i + 1] // green 
        pixles.data[i - 150] = pixles.data[i + 2] //blue
    }
    return pixles
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo()

video.addEventListener('canplay', paintToCanvas)