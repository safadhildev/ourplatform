const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const btnAddMedia = document.getElementById("btnAddMedia");

const onDeleteMedia = async (key, name, type) => {
  $(".addmedia-loading").css("display", "flex");
  console.log("Deleting... ", key);
  try {
    /**
     * 1) Delete from storage
     * 2) Delete from firestore
     */
    const mediaRef = storageRef.child(`media/${type}/${key}/${name}`);
    const docRef = db.collection(type).doc(key);
    await mediaRef.delete();
    await docRef.delete();
    alert(`Successfully deleted ${type}`);
    $(".addmedia-loading").css("display", "none");
  } catch (err) {
    alert(`Error`);
    console.log(err);
    $(".addmedia-loading").css("display", "none");
  }
};

const requestDelete = (key, name, type) => {
  console.log(key);
  console.log(name);
  console.log(type);
  if (confirm(`Are you sure you want to delete the ${type}?`)) {
    // Save it!
    onDeleteMedia(key, name, type);
  } else {
    // Do nothing!
    console.log("Delete cancelled");
  }
};

$(".btn-delete-image").on("click", function (e) {
  console.log("dede");
});

const renderImage = (data) => {
  $(".home-loading-image-text").css("display", "none");
  if (data.length > 0) {
    data.forEach((item) => {
      const div = `
      <div class="home-image-wrapper">
        <img src="${item.url}" />
        <div class="home-image-info">
          <p>${item.name}</p>
          <div onclick=requestDelete("${item.key}","${item.name}","image")><i class="far fa-trash-alt"></i></div>
        </div>
      </div>
    `;
      $(".home-image-list").append(div);
    });
  } else {
    $(".home-image-list").append(`<div></div>`);
  }
};

const renderAudio = (data) => {
  $(".home-loading-audio-text").css("display", "none");
  data.forEach((item) => {
    const div = `
      <div class="home-audio-item">
        <audio controls>
            <source src="${item.url}" type="audio/mp3">
            Your browser does not support the audio element.
        </audio>
        <div class="home-image-info">
          <p>${item.name}</p>
          <div onclick=requestDelete("${item.key}","${item.name}","audio")><i class="far fa-trash-alt"></i></div>
        </div>
      </div>
    `;
    $(".home-audio-list").append(div);
  });
};

const renderVideo = (data) => {
  $(".home-loading-video-text").css("display", "none");
  data.forEach((item) => {
    const div = `
      <div class="home-video-item">
        <video controls>
            <source id="addmediaVideoSrc" src="${item.url}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
         <div class="home-image-info">
          <p>${item.name}</p>
          <div onclick=requestDelete("${item.key}","${item.name}","video")><i class="far fa-trash-alt"></i></div>
        </div>
        </div>
    `;
    $(".home-video-list").append(div);
  });
};

const getAudio = async () => {
  $(".home-loading-audio-text").css("display", "block");
  try {
    const mediaSnapshot = await db.collection("audio").get();
    const data = mediaSnapshot.docs.map((doc) => doc.data());
    renderAudio(data);
  } catch (err) {
    console.log("getMedia => ", { err });
  }
};

const getVideo = async () => {
  $(".home-loading-video-text").css("display", "block");
  try {
    const mediaSnapshot = await db.collection("video").get();
    const data = mediaSnapshot.docs.map((doc) => doc.data());

    renderVideo(data);
  } catch (err) {
    console.log("getMedia => ", { err });
  }
};

/**
 * Get Image (realtime)
 * render
 */
db.collection("image").onSnapshot((querySnapshot) => {
  $(".home-image-list").empty();
  let images = [];
  querySnapshot.forEach((doc) => {
    images.push({
      key: doc.id,
      ...doc.data(),
    });
  });
  renderImage(images);
});

db.collection("audio").onSnapshot((querySnapshot) => {
  $(".home-audio-list").empty();
  let audios = [];
  querySnapshot.forEach((doc) => {
    audios.push({
      key: doc.id,
      ...doc.data(),
    });
  });
  renderAudio(audios);
});

db.collection("video").onSnapshot((querySnapshot) => {
  $(".home-video-list").empty();
  let videos = [];
  querySnapshot.forEach((doc) => {
    videos.push({
      key: doc.id,
      ...doc.data(),
    });
  });
  renderVideo(videos);
});

btnAddMedia.addEventListener("click", () => {
  window.location.href = "addmedia.html";
});
