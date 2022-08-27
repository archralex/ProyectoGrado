/* Copyright (c) 2017 UsefulAngle : http://codecanyon.net/user/UsefulAngle */

var PDFViewerPro = {
	// Holds all instances of PDF viewers in the page
	instances: [],

	next_page_svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.49 31.49" style="enable-background:new 0 0 31.49 31.49;" xml:space="preserve"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"/></svg>',

	prev_page_svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve"><path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/></svg>',

	full_screen_svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 215.35 215.35" style="enable-background:new 0 0 215.35 215.35;" xml:space="preserve"><g><path d="M7.5,65.088c4.143,0,7.5-3.358,7.5-7.5V25.61l48.305,48.295c1.465,1.464,3.384,2.196,5.303,2.196c1.92,0,3.84-0.732,5.304-2.197c2.929-2.929,2.929-7.678-0.001-10.606L25.604,15.002h31.985c4.142,0,7.5-3.358,7.5-7.5c0-4.142-3.357-7.5-7.5-7.5H7.5c-4.143,0-7.5,3.358-7.5,7.5v50.087C0,61.73,3.357,65.088,7.5,65.088z"/>	<path d="M207.85,150.262c-4.143,0-7.5,3.358-7.5,7.5v31.979l-49.792-49.792c-2.93-2.929-7.678-2.929-10.607,0c-2.929,2.929-2.929,7.678,0,10.606l49.791,49.791h-31.977c-4.143,0-7.5,3.358-7.5,7.5c0,4.142,3.357,7.5,7.5,7.5h50.086c4.143,0,7.5-3.358,7.5-7.5v-50.084C215.35,153.62,211.992,150.262,207.85,150.262z"/><path d="M64.792,139.949L15.005,189.74v-31.978c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v50.086c0,4.142,3.357,7.5,7.5,7.5h50.084c4.142,0,7.5-3.358,7.5-7.5s-3.357-7.5-7.5-7.5H25.611l49.788-49.793c2.929-2.929,2.929-7.678-0.001-10.607C72.471,137.02,67.722,137.02,64.792,139.949z"/><path d="M207.85,0.002h-50.086c-4.143,0-7.5,3.358-7.5,7.5c0,4.142,3.357,7.5,7.5,7.5h31.979l-48.298,48.301c-2.929,2.929-2.929,7.678,0.001,10.607c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.733,5.304-2.197l48.298-48.301v31.98c0,4.142,3.357,7.5,7.5,7.5c4.143,0,7.5-3.358,7.5-7.5V7.502C215.35,3.359,211.992,0.002,207.85,0.002z"/></g></svg>',

	normal_screen_svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="357px" height="357px" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve"><g><path d="M0,280.5h76.5V357h51V229.5H0V280.5z M76.5,76.5H0v51h127.5V0h-51V76.5z M229.5,357h51v-76.5H357v-51H229.5V357z M280.5,76.5V0h-51v127.5H357v-51H280.5z"/></g></svg>',

	download_svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 129 129"><g><path d="m61.5,107.1c0.4,0.4 0.9,0.7 1.4,0.9 0,0 0,0 0.1,0 0.5,0.2 1,0.3 1.6,0.3s1.1-0.1 1.6-0.3c0,0 0,0 0.1,0 0.5-0.2 1-0.5 1.4-0.9l56.9-56.9c1.7-1.7 1.7-4.4 0-6.1-1.7-1.7-4.4-1.7-6.1,0l-49.7,49.5v-82.8c0-2.4-1.9-4.3-4.3-4.3-2.4,0-4.3,1.9-4.3,4.3v82.9l-49.5-49.6c-1.7-1.7-4.4-1.7-6.1,0-1.7,1.7-1.7,4.4 0,6.1l56.9,56.9z"/><path d="m7.6,122.6h113.8c2.4,0 4.3-1.9 4.3-4.3 0-2.4-1.9-4.3-4.3-4.3h-113.8c-2.4,0-4.3,1.9-4.3,4.3 0,2.3 1.9,4.3 4.3,4.3z"/></g></svg>',

	cancel_svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></svg>',

	resize_timeout: null,

	full_screen_element_handled: 0,

	init: function() {
		// Fullscreen change events can be added only to the "document", and not to a particular element
		// Vendor prefixed events
		document.addEventListener('mozfullscreenchange', function() {
			this.screenChange();
		}.bind(this));

		document.addEventListener('webkitfullscreenchange', function(e) {
			this.screenChange();
		}.bind(this));

		document.addEventListener('MSFullscreenChange', function(e) {
			this.screenChange();
		}.bind(this));

		document.addEventListener('fullscreenchange', function(e) {
			this.screenChange();
		}.bind(this));

		// On window resize, resize viewers in page
		// Full-screen change events also result in resize event
		window.addEventListener('resize', function(e) {
			// If full-screen enter event then don't proceed
			if(this.getFullScreenElement() !== null)
				return;

			if(this.resize_timeout === null && this.instances.length != 0) {
      			this.resize_timeout = setTimeout(function() {
      				this.resize_timeout = null;

      				// If full-screen exit event occured then don't handle it
					if(this.full_screen_element_handled == 1) {
						this.full_screen_element_handled = 0;
						return;
					}
	        		
	        		for(var i=0; i<this.instances.length; i++) {
	        			if(this.instances[i]._PAGE_RENDERING_IN_PROGRESS == 0) {
		        			if(this.instances[i]._MODE == 'NORMAL') {
		        				this.instances[i]._CANVAS_WIDTH = this.instances[i]._DOM_ELEMENT.querySelector('.pdf-pro-canvas-container').getBoundingClientRect().width - 2;
								this.instances[i]._CANVAS.setAttribute('width', this.instances[i]._CANVAS_WIDTH);	
		        			}
		        			else {
		        				this.instances[i]._VIEWER_MODAL_WIDTH = this.instances[i].getModalWidth();
						
								this.instances[i]._DOM_ELEMENT.querySelector('.pdf-pro-main-container').style.width = this.instances[i]._VIEWER_MODAL_WIDTH + 'px';
								this.instances[i]._CANVAS.setAttribute('width', this.instances[i]._VIEWER_MODAL_WIDTH - 2);
		        			}

		        			this.instances[i].showPage(this.instances[i]._CURRENT_PAGE);
	        			}
	        		}
	       		}.bind(this), 100);
    		}
		}.bind(this));

		var plugin_elements = document.querySelectorAll('.pdf-pro-plugin');
		for(var i=0; i<plugin_elements.length; i++) {
			this.addInstance(plugin_elements[i]);
		}
	},

	// Get current element in full-screen mode
	getFullScreenElement: function() {
		return ( document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null );
	},

	// On entering/exiting fullscreen 
	screenChange: function() {
		// Checking for any fullscreen element
		var full_screen_element = this.getFullScreenElement();

		// Will hold the instance ID of the PDF viewer, initially set to null
		var instance_id = null;
			
		// On entering fullscreen
		if(full_screen_element !== null) {
			// Instance ID of that element
			instance_id = full_screen_element.getAttribute('data-instance-id');
			
			if(instance_id !== null) {
				this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-canvas-container').focus();

				// Set width to 100%
				this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-main-container').style.width = '100%';
		
				// Set width of canvas to 98% of screen width - 2px (the border width of either sides)
				this.instances[instance_id]._CANVAS.setAttribute('width', (parseInt(screen.width*0.98, 10)-2));
				// Show the current page
				this.instances[instance_id].showPage(this.instances[instance_id]._CURRENT_PAGE);
				
				// Fullscreen mode for viewer is active
				this.instances[instance_id]._FULL_SCREEN = 1;
				this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-full-screen').style.display = 'none';
				this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-close').style.display = 'inline-block';
			}
		}
		// On exiting fullscreen
		else {
			// Get the viewer instance which was in fullscreen mode
			for(var i=0; i<this.instances.length; i++) {
				if(this.instances[i]._FULL_SCREEN == 1) {
					instance_id = i;
					break;
				}
			}

			// If viewer is found
			if(instance_id !== null) {
				// Set width of the canvas to the width of the DOM container - 2px (border on each side)
				if(this.instances[instance_id]._MODE != 'NORMAL') {
					this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-main-container').focus();
					this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-main-container').style.width = this.instances[instance_id]._VIEWER_MODAL_WIDTH + 'px';
					this.instances[instance_id]._CANVAS.setAttribute('width', this.instances[instance_id]._VIEWER_MODAL_WIDTH - 2);
					this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-close').style.display = 'inline-block';
				}
				else {
					this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-canvas-container').blur();
					this.instances[instance_id]._CANVAS.setAttribute('width', this.instances[instance_id]._CANVAS_WIDTH);
					this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-close').style.display = 'none';
				}

				// Show the page
				this.instances[instance_id].showPage(this.instances[instance_id]._CURRENT_PAGE);

				this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-container').style.width = 'auto';
				
				// Fullscreen mode for viewer is deactivated
				this.instances[instance_id]._FULL_SCREEN = 0;
				this.instances[instance_id]._DOM_ELEMENT.querySelector('.pdf-pro-full-screen').style.display = 'inline-block';

				PDFViewerPro.full_screen_element_handled = 1;
			}
		}
	},

	// Add a new instance of the PDF viewer
	addInstance: function(dom_element) {
		this.instances.push( new PDFViewerProInstance(
								( dom_element.getAttribute('data-pdf-url') ), 
								( dom_element ),
								( dom_element.getAttribute('data-color') === null ? '#666666' : dom_element.getAttribute('data-color') ), 
								( dom_element.getAttribute('data-mode') === null ? 'NORMAL' : dom_element.getAttribute('data-mode').toUpperCase() ),
								( dom_element.getAttribute('data-protection-key') ),
								( dom_element.getAttribute('data-toolbar-position') === null ? 'top' : dom_element.getAttribute('data-toolbar-position') ),
								( dom_element.getAttribute('data-show-download-button') === null ? 1 : dom_element.getAttribute('data-show-download-button') ),
								( dom_element.getAttribute('data-enable-analytics') === null ? '0' : dom_element.getAttribute('data-enable-analytics') ),
								( dom_element.getAttribute('data-page-view-seconds') === null ? 1 : dom_element.getAttribute('data-page-view-seconds') ),
								( dom_element.getAttribute('data-impression-analytics-callback') === null ? null : dom_element.getAttribute('data-impression-analytics-callback') ),
								( dom_element.getAttribute('data-fully-viewed-analytics-callback') === null ? null : dom_element.getAttribute('data-fully-viewed-analytics-callback') ),
								( dom_element.getAttribute('data-google-analytics-tracking-id') === null ? null : dom_element.getAttribute('data-google-analytics-tracking-id') )
							) 
						);
	},

	decodeKey: function(hashed) {
		var front_end_padding_removed = hashed.slice(4, -4),
			middle_padding = front_end_padding_removed.substr(3, 3),
			middle_padding_removed = front_end_padding_removed.replace(middle_padding, '');
			inverted = middle_padding_removed.split('').reverse().join(''),
			final_key = atob(inverted);
	
		return final_key;
	}
};

function PDFViewerProInstance(pdf_url, dom_element, color, mode, protection_key, toolbar_position, show_download_button, enable_analytics, page_view_seconds, impression_analytics_callback, fully_viewed_analytics_callback, google_analytics_tracking_id) {
	// Viewer mode
	this._MODE = mode;

	// DOM element that holds the PDF viewer
	// In text mode a new <div> is created to hold the PDF viewer
	this._DOM_ELEMENT = ( this._MODE == 'TEXT' ? document.body.appendChild(document.createElement('div')) : dom_element );

	// Holds the text element in text mode
	this._TEXT_DOM_ELEMENT = ( this._MODE == 'TEXT' ? dom_element : null );
	
	// Each viewer has an ID (starting from 1)
	this._INSTANCE_ID = PDFViewerPro.instances.length;
	
	// Whether currently in full-screen
	this._FULL_SCREEN = 0;

	// URL of the PDF
	this._PDF_URL = pdf_url;

	// PDF protection key
	this._PROTECTION_KEY = protection_key;

	// Show / hide download button
	this._SHOW_DOWNLOAD_BUTTON = show_download_button;

	// Theme color code
	this._COLOR = color;
	
	// Keeps the handle to the PDF
	this._PDF_DOC;

	// Current Page
	this._CURRENT_PAGE;
	
	// Total no of pages in PDF
	this._TOTAL_PAGES;

	// Whether a page is currently being rendered
	// While page is rendering menu buttons will not work
	this._PAGE_RENDERING_IN_PROGRESS = 0;

	// Handle to the canvas element
	this._CANVAS;

	// 2D context of the canvas
	this._CANVAS_CTX;

	var dom_styles = window.getComputedStyle(this._DOM_ELEMENT, null);

	// Width of the viewer as passed
	this._VIEWER_WIDTH = dom_element.clientWidth - ( parseInt(dom_styles.getPropertyValue('border-left-width'), 10) + parseInt(dom_styles.getPropertyValue('border-right-width'), 10) + parseInt(dom_styles.getPropertyValue('padding-left'), 10) + parseInt(dom_styles.getPropertyValue('padding-right'), 10) );

	// Actual width of the PDF 
	this._PDF_WIDTH = -1;

	// Actual height of the PDF 
	this._PDF_HEIGHT = -1;

	// Inline mode is being initialized : 0 or 1
	this._INLINE_MODE_INITIALIZING = (mode != 'NORMAL' ? 1 : 0);

	// Height of the menu - 45(button height) + 4(top border) + 1(bottom border)
	this._PDF_META_CONTAINER_HEIGHT = 50;

	// Menubar position - top or bottom
	this._PDF_META_CONTAINER_POSITION = toolbar_position;

	// Width of Viewer as modal
	this._VIEWER_MODAL_WIDTH = -1;

	// Width of the canvas in normal mode
	this._CANVAS_WIDTH = -1;

	// Enable or disable analytics
	this._ENABLE_ANALYTICS = enable_analytics;

	// Variable that holds timeout while calculating page analytics
	this._PDF_PAGE_VIEWED_TIMEOUT_VAR = null;

	// Seconds after which page is considered viewed
	this._PDF_PAGE_VIEWED_TIMEOUT_SECONDS = page_view_seconds;

	// PDF Impression analytics callback function
	this._PDF_IMPRESSION_ANALYTICS_CALLBACK = impression_analytics_callback;

	// PDF fully viewed analytics callback function
	this._PDF_FULLY_VIEWED_ANALYTICS_CALLBACK = fully_viewed_analytics_callback;

	// Google Analytics tracking ID, if using Google Analytics to save analytics data
	this._GOOGLE_ANALYTICS_TRACKING_ID = google_analytics_tracking_id;

	// Array that holds pages of PDF have been read or not
	// 1 = read, 0 = not read
	this._PDF_PAGES_VIEWED = [];

	// Whether PDF impression data has been sent to callback
	this._PDF_IMPRESSION_DATA_SENT = 0;

	// Whether PDF fully viewed data has been sent to callback
	this._PDF_FULLY_VIEWED_DATA_SENT = 0;

	this.addHTML();
	this.addEvents();
	this.showPDF();
}

PDFViewerProInstance.prototype = {
	// Add the HTML required for the PDF viewer
	addHTML: function() {
		var html =	'<div class="pdf-pro-main-container pdf-pro-main-container-' + this._INSTANCE_ID + '" tabindex="0">' + 
						'<div class="pdf-pro-container">' + 
							'<div class="pdf-pro-loader">' + 
								'<div class="pdf-pro-loading-bar"><div class="pdf-pro-loading-completed" style="background-color:' + this._COLOR + '"></div></div>' + 
							'</div>' + 
							'<div class="pdf-pro-contents ' + (this._PDF_META_CONTAINER_POSITION == 'top' ? 'pdf-pro-contents-top' : 'pdf-pro-contents-bottom') + '">' + 
								(this._PDF_META_CONTAINER_POSITION == 'bottom' ? '<div class="pdf-pro-canvas-container" tabindex="0"><canvas class="pdf-pro-canvas pdf-pro-canvas-top"></canvas></div>' : '') + 
								'<div class="pdf-pro-meta ' + (this._PDF_META_CONTAINER_POSITION == 'top' ? 'pdf-pro-meta-top' : 'pdf-pro-meta-bottom') + '" style="' + (this._PDF_META_CONTAINER_POSITION == 'top' ? 'border-top-color' : 'border-bottom-color') + ':' + this._COLOR + '">' +
									'<div class="pdf-pro-meta-border">' + 
										'<div class="pdf-pro-buttons-1">' + 
											'<span class="pdf-pro-prev pdf-pro-button" title="Previous Page">' + PDFViewerPro.prev_page_svg + '</span><span class="pdf-pro-next pdf-pro-button" title="Next Page">' + PDFViewerPro.next_page_svg + '</span>' + 
										'</div>' + 
										'<div class="pdf-pro-page-count-container"><div class="pdf-pro-current-page" style="color:' + this._COLOR + '"></div><div class="pdf-pro-page-divider">of</div><div class="pdf-pro-total-pages" style="color:' + this._COLOR + '"></div></div>' + 
										'<div class="pdf-pro-buttons-2">' + 
											( this._SHOW_DOWNLOAD_BUTTON == 1 ? '<a class="pdf-pro-download pdf-pro-button" title="Download" download target="_blank" href="' + this._PDF_URL + '">' + PDFViewerPro.download_svg + '</a>' : '' ) + '<span class="pdf-pro-full-screen pdf-pro-button" title="View in Full Screen" style="color:' + this._COLOR + '">' + PDFViewerPro.full_screen_svg + '</span><span class="pdf-pro-close pdf-pro-button" title="Close">' + PDFViewerPro.cancel_svg + '</span>' + 
										'</div>' +
									'</div>' +		 
								'</div>' + 
								(this._PDF_META_CONTAINER_POSITION == 'top' ? '<div class="pdf-pro-canvas-container" tabindex="0"><canvas class="pdf-pro-canvas pdf-pro-canvas-bottom"></canvas></div>' : '') + 
							'</div>' + 
						'</div>' + 
					'</div>';

		if(this._MODE != 'NORMAL')
			html = (this._MODE == 'IMAGE' ? '<div class="pdf-pro-image-mode"></div>' : '') + '<div style="display:none" class="pdf-pro-modal pdf-pro-modal-' + this._INSTANCE_ID + '">' + html + '</div>';

		this._DOM_ELEMENT.insertAdjacentHTML('beforeend', html);
		this._CANVAS = this._DOM_ELEMENT.querySelector('.pdf-pro-canvas');
		this._CANVAS_CTX = this._CANVAS.getContext('2d');

		// Set instance id as a data attribute
		// On screenchange events, this is useful to find the source PDF viewer
		this._DOM_ELEMENT.querySelector('.pdf-pro-main-container').setAttribute('data-instance-id', this._INSTANCE_ID);

		// Insert stylesheet to create CSS rule for SVG fill color
		var element = document.createElement('style');
		document.head.appendChild(element);
		element.sheet.insertRule('.pdf-pro-main-container-' + this._INSTANCE_ID + ' svg polygon, .pdf-pro-main-container-' + this._INSTANCE_ID + ' svg path { fill: ' + this._COLOR + '; }', 0);
		
		if(this._MODE != 'NORMAL') {
			this._DOM_ELEMENT.querySelector('.pdf-pro-close').style.display = 'inline-block';

			// Show modal in image and text modes
			if(this._MODE == 'IMAGE') {
				this._DOM_ELEMENT.querySelector('.pdf-pro-image-mode').addEventListener('click', function() {
					// Send impression analytics
					if(this._ENABLE_ANALYTICS == 1 && this._PDF_IMPRESSION_DATA_SENT == 0)
						this.sendPdfImpressionAnalyticsData();

					this._DOM_ELEMENT.querySelector('.pdf-pro-modal').style.display = 'block';
					this._DOM_ELEMENT.querySelector('.pdf-pro-main-container').focus();	
				}.bind(this));
			}
			else if(this._MODE == 'TEXT') {
				this._TEXT_DOM_ELEMENT.addEventListener('click', function(e) {
					// Send impression analytics
					if(this._ENABLE_ANALYTICS == 1 && this._PDF_IMPRESSION_DATA_SENT == 0)
						this.sendPdfImpressionAnalyticsData();

					this._DOM_ELEMENT.querySelector('.pdf-pro-modal').style.display = 'block';
					this._DOM_ELEMENT.querySelector('.pdf-pro-main-container').focus();
					e.preventDefault();
				}.bind(this));
			}

			this._DOM_ELEMENT.querySelector('.pdf-pro-modal').addEventListener('click', function() {
				this.style.display = 'none';			
			});
		}
	},

	// Add events required for the PDF viewer
	addEvents: function() {
		// Click event on previous page button
		this._DOM_ELEMENT.querySelector('.pdf-pro-prev').addEventListener('click', function(e) {
			// If previous page view analytics was in progress then cancel it
			// User moved to previous page without waiting for specified seconds 
			if(this._ENABLE_ANALYTICS == 1 && this._PDF_PAGE_VIEWED_TIMEOUT_VAR !== null) {
				clearTimeout(this._PDF_PAGE_VIEWED_TIMEOUT_VAR);
				this._PDF_PAGE_VIEWED_TIMEOUT_VAR = null;
			}

			if(this._CURRENT_PAGE != 1 && this._PAGE_RENDERING_IN_PROGRESS == 0)
				this.showPage(--this._CURRENT_PAGE);

			e.stopPropagation();
		}.bind(this));

		// Click event on next page button
		this._DOM_ELEMENT.querySelector('.pdf-pro-next').addEventListener('click', function(e) {
			// Send impression analytics
			if(this._ENABLE_ANALYTICS == 1 && this._PDF_IMPRESSION_DATA_SENT == 0)
				this.sendPdfImpressionAnalyticsData();

			// If previous page view analytics was in progress then cancel it
			// User moved to next page without waiting for specified seconds 
			if(this._ENABLE_ANALYTICS == 1 && this._PDF_PAGE_VIEWED_TIMEOUT_VAR !== null) {
				clearTimeout(this._PDF_PAGE_VIEWED_TIMEOUT_VAR);
				this._PDF_PAGE_VIEWED_TIMEOUT_VAR = null;
			}

			if(this._CURRENT_PAGE != this._TOTAL_PAGES && this._PAGE_RENDERING_IN_PROGRESS == 0)
				this.showPage(++this._CURRENT_PAGE);

			e.stopPropagation();
		}.bind(this));

		// Click event on enter/exit fullscreen button
		this._DOM_ELEMENT.querySelector('.pdf-pro-full-screen').addEventListener('click', function(e) {
			if(this._PAGE_RENDERING_IN_PROGRESS == 0) {
				if(this._FULL_SCREEN == 0) {
					// Send impression analytics
					if(this._ENABLE_ANALYTICS == 1 && this._PDF_IMPRESSION_DATA_SENT == 0)
						this.sendPdfImpressionAnalyticsData();

					this.goInFullscreen();
				}
				else {
					this.goOutFullscreen();
				}
			}

			e.stopPropagation();
		}.bind(this));

		// If download button available
		if(this._SHOW_DOWNLOAD_BUTTON == 1) {
			this._DOM_ELEMENT.querySelector('.pdf-pro-download').addEventListener('click', function(e) {
				// Send impression analytics
				if(this._ENABLE_ANALYTICS == 1 && this._PDF_IMPRESSION_DATA_SENT == 0)
					this.sendPdfImpressionAnalyticsData();

				e.stopPropagation();
			}.bind(this));
		}

		// Click event on close button
		this._DOM_ELEMENT.querySelector('.pdf-pro-close').addEventListener('click', function(e) {
			// If full-screen
			if(this._FULL_SCREEN == 1) {
				if(this._PAGE_RENDERING_IN_PROGRESS == 0) {
					this.goOutFullscreen();
				}
			}
			// If modal
			else {
				this._DOM_ELEMENT.querySelector('.pdf-pro-modal').style.display = 'none';
			}

			e.stopPropagation();
		}.bind(this));

		// Click event on main container - in full screen mode 98% of PDF is seen
		this._DOM_ELEMENT.querySelector('.pdf-pro-main-container').addEventListener('click', function(e) {
			e.stopPropagation();
		}.bind(this));

		// Scroll page on keyboard right, left, up & down button event
		this._DOM_ELEMENT.querySelector('.pdf-pro-main-container').addEventListener('keydown', function(e) {
			switch(e.keyCode) {
				case 37:
					this._DOM_ELEMENT.querySelector('.pdf-pro-prev').click();
					break;

				case 38:
					if(this._FULL_SCREEN == 0)
						this._DOM_ELEMENT.querySelector('.pdf-pro-prev').click();
					break;

				case 39:
					this._DOM_ELEMENT.querySelector('.pdf-pro-next').click();
					break;

				case 40:
					if(this._FULL_SCREEN == 0)
						this._DOM_ELEMENT.querySelector('.pdf-pro-next').click();
					break;
			}

			e.stopPropagation();
			e.preventDefault();
		}.bind(this));

		// Keyboard right and left button event in full-screen mode
		this._DOM_ELEMENT.querySelector('.pdf-pro-canvas-container').addEventListener('keydown', function(e) {
			switch(e.keyCode) {
				case 37:
					this._DOM_ELEMENT.querySelector('.pdf-pro-prev').click();
					break;

				case 38:
					if(this._FULL_SCREEN == 0)
						this._DOM_ELEMENT.querySelector('.pdf-pro-prev').click();
					break;

				case 39:
					this._DOM_ELEMENT.querySelector('.pdf-pro-next').click();
					break;

				case 40:
					if(this._FULL_SCREEN == 0)
						this._DOM_ELEMENT.querySelector('.pdf-pro-next').click();
					break;
			}

			e.stopPropagation();
			if(this._FULL_SCREEN == 0)
				e.preventDefault();
		}.bind(this));
	},

	// Initialize displaying the PDF
	showPDF: function() {
		this._DOM_ELEMENT.querySelector(".pdf-pro-loader").style.display = 'block';

		var pdf_params = { url: this._PDF_URL };
		if(this._PROTECTION_KEY !== null) 
			pdf_params['password'] = PDFViewerPro.decodeKey(this._PROTECTION_KEY);

		PDFJS.getDocument(pdf_params, false, null, function(progress) {
			// Show the PDF loaded percentage
			var percent_loaded = (progress.loaded/progress.total)*100;

			this._DOM_ELEMENT.querySelector(".pdf-pro-loading-completed").style.width = percent_loaded + '%';
		}.bind(this)).then(function(pdf_doc) {
			// Handle of the PDF
			this._PDF_DOC = pdf_doc;
			this._TOTAL_PAGES = this._PDF_DOC.numPages;

			if(this._ENABLE_ANALYTICS == 1) {
				this._PDF_PAGES_VIEWED.push(1);
				for(var i=1; i<this._TOTAL_PAGES; i++) {
					this._PDF_PAGES_VIEWED.push(0);
				}
			}
			
			// Hide the pdf loader and show pdf container in HTML
			this._DOM_ELEMENT.querySelector(".pdf-pro-loader").style.display = 'none';
			this._DOM_ELEMENT.querySelector(".pdf-pro-contents").style.display = 'block';
			this._DOM_ELEMENT.querySelector(".pdf-pro-total-pages").textContent = this._TOTAL_PAGES;

			// Show the first page
			this.showPage(1);
		}.bind(this)).catch(function(error) { console.log(error.message)
			// On error
			this._DOM_ELEMENT.innerHTML = error.message;
		}.bind(this));
	},

	// Send PDF impression data to server
	sendPdfImpressionAnalyticsData: function() {
		this._PDF_IMPRESSION_DATA_SENT = 1;
		if(this._PDF_IMPRESSION_ANALYTICS_CALLBACK !== null)
			window[this._PDF_IMPRESSION_ANALYTICS_CALLBACK]( 'PDF-' + (this._INSTANCE_ID + 1) );

		if(this._GOOGLE_ANALYTICS_TRACKING_ID !== null) {
			if(ga !== null) {
				ga('create', this._GOOGLE_ANALYTICS_TRACKING_ID, 'auto', 'PDFViewer');
				ga('PDFViewer.send', 'event', 'PDF', 'Impression', this._PDF_URL);
			}
		}
	},

	// Sed PDF fully viewed data to server
	sendPdfFullyViewedAnalyticsData: function() {
		this._PDF_FULLY_VIEWED_DATA_SENT = 1;
		if(this._PDF_FULLY_VIEWED_ANALYTICS_CALLBACK !== null)
			window[this._PDF_FULLY_VIEWED_ANALYTICS_CALLBACK]( 'PDF-' + (this._INSTANCE_ID + 1) );

		if(this._GOOGLE_ANALYTICS_TRACKING_ID !== null) {
			if(ga !== null) {
				ga('PDFViewer.send', 'event', 'PDF', 'Fully-Viewed', this._PDF_URL);
			}
		}
	},

	// Calculate page viewed analytics 
	calculatePageViewedAnalytics: function() {
		if(this._PDF_PAGES_VIEWED[this._CURRENT_PAGE - 1] == 0) {
			this._PDF_PAGE_VIEWED_TIMEOUT_VAR = setTimeout(function() {
				this._PDF_PAGES_VIEWED[this._CURRENT_PAGE - 1] = 1;
				this._PDF_PAGE_VIEWED_TIMEOUT_VAR = null;

				// Check whether all pages have been viewed
				if(this._PDF_FULLY_VIEWED_DATA_SENT == 0) {
					var all_pages_read = 1;
					for(var i=0; i<this._PDF_PAGES_VIEWED.length; i++) {
						if(this._PDF_PAGES_VIEWED[i] == 0) {
							all_pages_read = 0;
							break;
						}
					}

					// If all pages have been viewed
					if(all_pages_read == 1) {
						this.sendPdfFullyViewedAnalyticsData();
					}
				}
			}.bind(this), this._PDF_PAGE_VIEWED_TIMEOUT_SECONDS*1000);
		}
	},

	// Show a particular page of the PDF
	showPage: function(page_no) {
		// Page is being rendered
		this._PAGE_RENDERING_IN_PROGRESS = 1;
		this._CURRENT_PAGE = page_no;

		// Update current page in HTML
		this._DOM_ELEMENT.querySelector(".pdf-pro-current-page").textContent = page_no;
		
		// Fetch the page
		this._PDF_DOC.getPage(page_no).then(function(page) {
			// Save PDF actual width & height 
			if(this._PDF_WIDTH == -1) {
				this._PDF_WIDTH = page.getViewport(1).width;
				this._PDF_HEIGHT = page.getViewport(1).height;
				
				if(this._MODE == 'NORMAL') {
					// Canvas width = parent container width - 2 (border on each side)
					this._CANVAS_WIDTH = Math.ceil(this._DOM_ELEMENT.querySelector('.pdf-pro-canvas-container').getBoundingClientRect().width) - 2;
					this._CANVAS.setAttribute('width', this._CANVAS_WIDTH);
				}
				else {
					this._CANVAS.setAttribute('width', this._VIEWER_WIDTH - 2);
				}
			}

			// As the canvas is of a fixed width we need to set the scale of the viewport accordingly
			var scale_required = this._CANVAS.width / page.getViewport(1).width;

			// Get viewport of the page at required scale
			var viewport = page.getViewport(scale_required);

			// Set canvas height
			this._CANVAS.height = viewport.height;

			var renderContext = {
				canvasContext: this._CANVAS_CTX,
				viewport: viewport
			};

			// Render the page contents in the canvas
			page.render(renderContext).then(function() {
				// Page has finished rendering
				this._PAGE_RENDERING_IN_PROGRESS = 0;

				// Scroll to top on full-screen
				if(this._FULL_SCREEN == 1)
					this._DOM_ELEMENT.querySelector('.pdf-pro-canvas-container').scrollTop = 0;

				// In image & text modes, get the allowed modal width and show viewer
				if(this._INLINE_MODE_INITIALIZING == 1) {
					if(this._MODE == 'IMAGE')
						this._DOM_ELEMENT.querySelector('.pdf-pro-image-mode').innerHTML = '<img src="' + this._CANVAS.toDataURL('image/jpeg', 1) + '" />';
					
					this._INLINE_MODE_INITIALIZING = 0;

					this._VIEWER_MODAL_WIDTH = this.getModalWidth();
					
					this._DOM_ELEMENT.querySelector('.pdf-pro-main-container').style.width = this._VIEWER_MODAL_WIDTH + 'px';
					this._CANVAS.setAttribute('width', this._VIEWER_MODAL_WIDTH - 2);
					this.showPage(1);
				}
				else {
					if(this._ENABLE_ANALYTICS == 1)
						this.calculatePageViewedAnalytics();
				}
			}.bind(this));
		}.bind(this));
	},

	// Get the modal width
	getModalWidth: function() {
		var available_pdf_height = window.innerHeight - 20 - this._PDF_META_CONTAINER_HEIGHT,
			calculated_pdf_width = Math.floor( (this._PDF_WIDTH/this._PDF_HEIGHT)*available_pdf_height );

		// If calculated width is greater than (window width-20) then choose (window width -20)
		return ( calculated_pdf_width > (window.innerWidth - 20) ? (window.innerWidth - 20) : calculated_pdf_width );
	},

	// Go to fullscreen mode
	goInFullscreen: function() {
		var element = this._DOM_ELEMENT.querySelector('.pdf-pro-main-container');

		if(element.requestFullscreen)
			element.requestFullscreen();
		else if(element.mozRequestFullScreen)
			element.mozRequestFullScreen();
		else if(element.webkitRequestFullscreen)
			element.webkitRequestFullscreen();
		else if(element.msRequestFullscreen)
			element.msRequestFullscreen();
	},

	// Exit fullscreen mode
	goOutFullscreen: function() {
		if(document.exitFullscreen)
			document.exitFullscreen();
		else if(document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if(document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if(document.msExitFullscreen)
			document.msExitFullscreen();
	}
};

// Initialize library
PDFViewerPro.init();