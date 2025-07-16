class VideoPlayer {
	constructor() {
		this.video_model = document.querySelector('.video_model');
		this.crossButton = document.querySelector('.cross_button');
		this.pauseButton = document.querySelector('.pause_button');
		this.center_content = document.querySelector('.center_content');
		this.videoElement = document.querySelector('.center_content video');
		this.siderBar_slider = document.querySelector('.siderBar_slider');
		this.muted_button = document.getElementById('muted_button');
		this.unmuted_button = document.getElementById('unmuted_button');
		this.slide_item = document.querySelectorAll('.slide_item');
		this.share_button = document.querySelector('.share_button');
		this.share_popup = document.querySelector('.share_popup');
		this.videoLinks = {
			'video1': 'https://krushkandy.com/cdn/shop/videos/c/vp/7954912b9e174efb93e2f422a8ec46c6/7954912b9e174efb93e2f422a8ec46c6.HD-1080p-7.2Mbps-40291290.mp4?v=0',
			'video2': 'https://krushkandy.com/cdn/shop/videos/c/vp/7f993379a0854f0db96be1001c5aa0a8/7f993379a0854f0db96be1001c5aa0a8.HD-1080p-7.2Mbps-40246702.mp4?v=0',
			'video3': 'https://krushkandy.com/cdn/shop/videos/c/vp/6451371248e24185a97525801492fffc/6451371248e24185a97525801492fffc.HD-1080p-7.2Mbps-40246569.mp4?v=0',
		}
		this.init();
	}
	init() {
		this.crossButton.addEventListener('click', () => this.closeVideoModel());
		this.pauseButton.addEventListener('click', (event) => this.togglePlayPause(event));
		this.center_content.addEventListener('click', (event) => this.togglePlayPause(event));
		this.muted_button.addEventListener('click', () => this.toggleSound());
		this.unmuted_button.addEventListener('click', () => this.toggleSound());
		this.slide_item.forEach((item) => {
			item.style.display = 'block'
			item.querySelector('video').addEventListener('click', (vs) => {
				this.openVideoModel();
				this.dynamicVideo(vs);
			});
		});
		this.share_button.addEventListener('click', () => this.toggleSharePopup());
		this.share_popup.querySelector('.croseIcon').addEventListener('click', () => this.toggleSharePopup());
		this.share_popup.querySelector('#copyToClipboard').addEventListener('click', (event) => this.copyToClipboard(event));
		this.siderBar_slider.querySelectorAll('.silder_dy_image img').forEach((image) => {
			image.addEventListener('click', (event) => this.changeVideo(event));
		});
		// this.generateThumbnail()
	}
	dynamicVideo(get) {
		this.videoElement.src = get.target.currentSrc;
		this.videoElement.play();
		this.videoElement.muted = false
	}
	closeVideoModel() {
		this.video_model.style.display = 'none';
		this.videoElement.pause();
		document.body.classList.toggle('bd-hidden');
	}
	openVideoModel() {
		this.video_model.style.display = 'block';
		this.pauseButton.style.display = 'none'
		this.videoElement.play();
		document.body.classList.toggle('bd-hidden');
	}
	togglePlayPause(event) {
		event.stopPropagation();
		this.videoElement.paused ? this.videoElement.play() : this.videoElement.pause();
		this.pauseButton.style.display = this.videoElement.paused ? 'block' : 'none';
	}
	toggleSharePopup() {
		this.share_popup.style.display = this.share_popup.style.display === 'flex' ? 'none' : 'flex';
	}
	copyToClipboard(event) {
		let text = this.share_popup.querySelector('.link_value').textContent.trim()
		navigator.clipboard.writeText(text)
		event.target.textContent = 'Link copied'
	}
	toggleSound() {
		this.videoElement.muted = !this.videoElement.muted;
		this.muted_button.style.display = this.videoElement.muted ? 'none' : 'block';
		this.unmuted_button.style.display = this.videoElement.muted ? 'block' : 'none';
	}
	changeVideo(event) {
		let video = this.center_content.querySelector('.videoContainer video');
		if (video.src != (this.videoLinks[event.target.className])) {
			video.src = this.videoLinks[event.target.className]
			this.videoElement.play()
			this.pauseButton.style.display = this.videoElement.paused ? 'block' : 'none';
		} else {
			this.videoElement.play()
			this.pauseButton.style.display = this.videoElement.paused ? 'block' : 'none';
		}
	}
	// generateThumbnail() {
	//     const canvases = this.siderBar_slider.querySelectorAll('.silder_dy_image canvas');
	//     const videoLinks = this.videoLinks;
	//     if (!videoLinks || Object.keys(videoLinks).length === 0) {
	//         console.error('No video links found.');
	//         return;
	//     }
	//     canvases.forEach((canvas, index) => {
	//         const videoKey = `video${index + 1}`;
	//         const videoSrc = videoLinks[videoKey];
	//         if (!videoSrc) {
	//             console.error(`No video source found for ${videoKey}`);
	//             return;
	//         }
	//         // Create a new video element for each canvas
	//         const video = document.createElement('video');
	//         video.src = videoSrc;
	//         video.preload = 'metadata';
	//         video.addEventListener('loadeddata', () => {
	//             video.currentTime = 2; // Move to 2 seconds into the video
	//         });
	//         video.addEventListener('seeked', () => {
	//             try {
	//                 const context = canvas.getContext('2d');
	//                 if (!context) {
	//                     console.error('Failed to get canvas context.');
	//                     return;
	//                 }
	//                 // Set canvas resolution to 100x100
	//                 const thumbnailWidth = 1024;
	//                 const thumbnailHeight = 1024;
	//                 canvas.width = thumbnailWidth;
	//                 canvas.height = thumbnailHeight;
	//                 // Draw the video frame scaled to 100x100
	//                 context.clearRect(0, 0, canvas.width, canvas.height);
	//                 context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, thumbnailWidth, thumbnailHeight);
	//                 console.log(`Thumbnail generated for ${videoKey}`);
	//             } catch (error) {
	//                 console.error(`Error generating thumbnail for ${videoKey}:`, error);
	//             }
	//         }, { once: true });
	//         video.addEventListener('error', () => {
	//             console.error(`Error loading video: ${videoSrc}`);
	//         });
	//         video.load();
	//     });
	// } 
}
document.addEventListener('DOMContentLoaded', () => {
	new VideoPlayer();
	let videosLoaded = 0;
	const totalVideos = document.querySelectorAll('.video_slider video');
	// (function checkVideosLoaded() {        
	//   if (videosLoaded === totalVideos.length) {
	//     document.querySelector('.video_slider').style.display = 'flex';
	//   }else{
	//     totalVideos[videosLoaded].play()
	//     videosLoaded += 1;
	//     checkVideosLoaded()
	//   }
	// })();
	totalVideos.forEach(video => {
		const interval = setInterval(() => {
			if (video.paused || video.currentTime === 0) {
				video.play();
			}
			// Check if video is playing, then clear the interval
			if (!video.paused && video.currentTime > 0) {
				clearInterval(interval);
			}
		}, 1000);
		video.addEventListener('timeupdate', () => {
			if (video.currentTime >= 5) {
				video.currentTime = 0;
				video.play();
			}
		});
	});
});