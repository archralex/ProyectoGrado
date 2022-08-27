$(document).ready( function(){

   var $body = $('body'),
       $html = $('html'),
       currentGrade = false,
       pageLoaded = false,
       w_w = $(window).width(),
       saveData = localStorage.getItem('ovasPasto'),
       $unidad = $('#unidad'),
       staticPage = $body.hasClass('static-page');

    if ( staticPage ) initPageScripts( $unidad, materiaObj );

    function sanitize( input ) {
		 return input.replace(/[^a-z0-9]/gi, '-').toLowerCase();
	 }

    tippy('.tippy-static', {
       placement: w_w > 600 ? 'right' : 'bottom',
       delay: 100,
       flip: false,
       arrow: true,
       duration: 300,
       animation: 'shift-toward'
    })

   if ( saveData ) {

      saveData = JSON.parse( saveData );

   } else {

      saveData = [];

   }

   $(window).on('resize', function(){

      //console.log('resize event');

   })

   window.onhashchange = function(){

      if ( !staticPage ) navigate();

   };

   function getPostArray() {

      var hash = window.location.hash.replace('#', '');

      return hash.split('/');

   }

   function navigate(){

      var hash = window.location.hash.replace('#', ''),
          post = hash.split('/'),
          targetExist = false,
          $lastSection = $('section.active');

      $lastSection.removeClass('active');

      setTimeout(function(){

         $lastSection.removeClass('show');

      }, 600);

      if ( hash ) {

         if ( post.length === 1 ) {

             var $target = $( '#' + hash );

             if ( $target.length ) {

                showPage( $target )

                targetExist = true;

             }

         }

         if ( !targetExist ) {

            currentGrade = post[0] * 1;

            var subs = ['Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo'];

            if ( currentGrade < 6  || currentGrade > 11 ) {

               showPage( $('#cover') )

               return;

            }

            if ( post.length === 1 ) {

               var $materias = $('#materias');

               $materias.find('.subtitle').html( subs[currentGrade-6] + ' grado' );

               $('.mat-wrapper > div').each(function(){

                  var $this = $(this),
                      numCursos = 0,
                      materia = $this.find('h2').text();

                  for (var i = 0; i < ovasDB.length; i++) {

                     if ( ovasDB[i].materia == materia && ovasDB[i].grado == currentGrade ) numCursos ++;

                  }

                  $this.find('p').html( numCursos + ' unidades' );

               });

               showPage( $materias )

            } else if ( post.length === 2 ) {

               var $this = $(this),
                   materia = post[1],
                   $programa = $('#programa'),
                   $programUl = $('.program'),
                   matsCount = 0;

               $programUl.html('');

               $programa.find('.main-title').text( materia );

               $programa.find('.subtitle').html( subs[currentGrade-6] + ' grado' );

               for (var i = 0; i < ovasDB.length; i++) {

                  if ( encodeOvaUrl(ovasDB[i].materia) == materia && ovasDB[i].grado == currentGrade ) {

                     matsCount++;

                     var $li = $('<li data-materia="' + ovasDB[i].nombre + '"><span>' + matsCount + '. ' + ovasDB[i].nombre + '</span> <button class="ver-unidad"><img src="img/ver-curso.png" /></button></li>');

                     if ( saveData.indexOf( ovasDB[i].nombre ) > -1 ) $li.addClass('completed');

                     $programUl.append( $li );

                  }

               }

               showPage( $programa )

            } else if ( post.length === 3 ) {

               var $this = $(this),
                   $unidad = $('#unidad'),
                   materiaObj = getMateria( post[2] ),
                   $content = $unidad.find('.content');

               $unidad.find('.main-title').text( materiaObj.nombre );
               $unidad.find('.subtitle').text( 'Competencias' );
               $unidad.find('nav li:first-child').addClass('active').siblings('.active').removeClass('active');

               $content.html('');

               $.ajax({
                 type: "POST",
                 url: materiaObj.url,
                 success: function( html ){

                    $content.html( html ).imagesLoaded().then(function(){

                         initPageScripts( $content, materiaObj );

                         showPage( $unidad );

                    });

                 },
                 dataType: 'html'
               });

            }

         }

      } else {

         showPage( $('#cover') );

      }

      function showPage( $page ) {

         if ( $html.scrollTop() ) {

            $('html, body').animate({
               scrollTop: 0
            }, 300, function(){

               addShowActive();

            });

         } else {

            addShowActive();

         }

         function addShowActive() {

            $page.addClass('show');

            setTimeout(function(){

               $page.addClass('active');

            }, 200);

         }

      } // showPage()

   } // navigate()

   function downclick() {

      $('#download-ova').on('click', function(){

         var hash = window.location.hash.replace('#', ''),
             post = hash.split('/');

         if ( post.length === 3 ) {

            var materiaObj = getMateria( post[2] );

            downloadOva( materiaObj );

         }

      });

   }

   if ( !staticPage ) downclick()

   function downloadOva( materiaObj ) {

      var zip = new JSZip(),
           filesToLoadList = [
           ['css/normalize.css', 'css/'],
           ['css/grid.css', 'css/'],
           ['css/owl.carousel.css', 'css/'],
           ['css/owl.theme.default.css', 'css/'],
           ['css/sweetalert2.min.css', 'css/'],
           ['css/crossword.css', 'css/'],
           ['css/pdf-viewer.css', 'css/'],
           ['css/main.css', 'css/'],
           ['js/vendor/modernizr-3.6.0.min.js', 'js/vendor/'],
           ['js/vendor/jquery-3.3.1.min.js', 'js/vendor/'],
           ['js/owl.carousel.min.js', 'js/'],
           ['js/sweetalert2.min.js', 'js/'],
           ['js/tippy.all.min.js', 'js/'],
           ['js/crossword.js', 'js/'],
           ['js/CustomEase.min.js', 'js/'],
           ['js/TweenMax.min.js', 'js/'],
           ['js/ThrowPropsPlugin.min.js', 'js/'],
           ['js/findShapeIndex.js', 'js/'],
           ['js/MorphSVGPlugin.js', 'js/'],
           ['js/ovasDB.js', 'js/'],
           ['js/draggable.bundle.js', 'js/'],
           ['js/sortable.js', 'js/'],
           ['js/pdfjs/pdf.js', 'js/pdfjs/'],
           ['js/filesaver.js', 'js/'],
           ['js/pdf-viewer.js', 'js/'],
           ['js/displace.min.js', 'js/'],
           ['js/jszip.min.js', 'js/'],
           ['js/jszip-utils.js', 'js/'],
           ['js/main.js', 'js/']

        ],
        imagesList = [
           ['img/bg.jpg', 'img/'],
           ['img/end-btt.png', 'img/'],
           ['img/cui-2.png', 'img/']
        ];

        $unidad.find('img').each(function(){

           var src = $(this).attr('src');

           imagesList.push( [ src,  src.replace(src.split('/').pop(), '') ] );

        });

        $unidad.find('image').each(function(){

           var src = $(this).attr('xlink:href');

           console.log(src);

           imagesList.push( [ src,  src.replace(src.split('/').pop(), '') ] );

        });

        function zipVideos( callback ) {

           var videoCounter = 0;

           $unidad.find('video').each(function(){

              var videoUrl = $(this).find('source').attr('src');

              //var fileURL = URL.createObjectURL( this )
               JSZipUtils.getBinaryContent(videoUrl, function (err, data) {

                  if(err) {
         	        console.log(err); // or handle the error
                  }

               	zip.file(videoUrl, data, {binary:true});

                  console.log('video zipped!');

                  callback();

               });

               videoCounter++;

           });

           if ( !videoCounter ) callback();

        }

        var ajaxCounter = 0,
            ovaTitle = sanitize( $('header > .main-title').text() );

        zipVideos(function(){

           zipImages();

           buildIndex(function(){

              console.log( 'build index callback' );

              zipAssets(function(){

                 zip.generateAsync({type:"blob"})
                 .then(function(content) {

                     console.log( 'Website ready!' );

                     saveAs(content, ovaTitle + ".zip");

                     zip = null;

                 });

              });

           });

        });

        function zipImages( callback ) {

           for (var i = 0; i < imagesList.length; i++) {

              zip.file(imagesList[i][1] + imagesList[i][0].split('/').pop(), urlToPromise(imagesList[i][0]), {binary:true});

           }

        }

        function zipAssets( callback ) {

           for (var i = 0; i < filesToLoadList.length; i++) {

              zipFiles( filesToLoadList[i][0], filesToLoadList[i][1], function(){

                 ajaxCounter++;

                 if ( ajaxCounter == filesToLoadList.length ) {

                    if ( zip ) {

                       callback();

                    }

                 }

              });

           }

        }

        function zipFiles( url, dir, callback ) {

           $.ajax({
              url: url,
              dataType: 'text',
              context: document.body
           }).done(function( data ){

              zip.file( dir + url.split('/').pop(), data);

              callback();

           }).fail(function(){

              console.log('zipFile failed');

              callback();

           });

        } // end of zipFile

        function urlToPromise(url) {
           return new Promise(function(resolve, reject) {
               JSZipUtils.getBinaryContent(url, function (err, data) {
                   if(err) {
                       reject(err);
                   } else {
                       resolve(data);
                   }
               });
           });
        }

        function buildIndex( callback ) {

           var pageHeader =
           '<!doctype html>\n' +
           '<html class="no-js" lang="">\n' +
           '  <head>\n' +
                 '    <meta charset="utf-8">\n' +
                 '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
                 '    <title>' + $('.main-title').text() + '</title>\n' +
                 '    <meta name="description" content="">\n' +
                 '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n' +
                 '<link rel="manifest" href="site.webmanifest">\n' +
                 '<link rel="apple-touch-icon" href="icon.png">\n' +
                 '<link rel="stylesheet" href="css/normalize.css">\n' +
                 '<link rel="stylesheet" href="css/grid.css">\n' +
                 '<link rel="stylesheet" href="css/owl.carousel.css">\n' +
                 '<link rel="stylesheet" href="css/owl.theme.default.css">\n' +
                 '<link rel="stylesheet" href="css/sweetalert2.min.css">\n' +
                 '<link rel="stylesheet" href="css/crossword.css">\n' +
                 '<link href="css/pdf-viewer.css" rel="stylesheet" type="text/css" />\n' +
                 '<link rel="stylesheet" href="css/main.css">\n' +
                 '<link href="https://fonts.googleapis.com/css?family=Amatic+SC:400,700|Open+Sans:400,600" rel="stylesheet" />\n' +
               '</head>\n' +
               '<body class="static-page">\n' +

               '<script> var materiaObj = '+ JSON.stringify ( materiaObj ) +' </script>\n' +

               '<div class="page-bg"></div>';

          console.log( materiaObj );

           var pageFooter =
           '<script src="js/vendor/modernizr-3.6.0.min.js"></script>\n' +
           '<script src="js/vendor/jquery-3.3.1.min.js"></script>\n' +
           '<script src="js/owl.carousel.min.js"></script>\n' +
           '<script src="js/sweetalert2.min.js"></script>\n' +
           '<script src="js/tippy.all.min.js" ></script>\n' +
           '<script src="js/crossword.js"></script>\n' +
           '<script src="js/CustomEase.min.js"></script>\n' +
           '<script src="js/TweenMax.min.js"></script>\n' +
           '<script src="js/ThrowPropsPlugin.min.js"></script>\n' +
           '<script src="js/findShapeIndex.js"></script>\n' +
           '<script src="js/MorphSVGPlugin.js"></script>\n' +
           '<script src="js/ovasDB.js"></script>\n' +
           '<script src="js/draggable.bundle.js"></script>\n' +
           '<script src="js/sortable.js"></script>\n' +
           '<script src="js/pdfjs/pdf.js"></script>\n' +
           '<script src="js/pdf-viewer.js"></script>\n' +
           '<script src="js/displace.min.js"></script>\n' +
           '<script src="js/jszip-utils.js"></script>\n' +
           '<script src="js/jszip.min.js"></script>\n' +
           '<script src="js/filesaver.js"></script>\n' +
           '<script src="js/main.js"></script>\n' +

         '</body>\n' +

         '</html>';

         $.ajax({
            url: materiaObj.url,
            dataType: 'text',
            context: document.body
         }).done(function( data ){

            var $unidadClone = $unidad.clone();

            $unidadClone.find('.sidebar').remove();

            $unidadClone.find('.content').html( data );

            $unidadClone.find( 'nav li:first-child' ).addClass('active').siblings().removeClass('active');

            var pageBody = $unidadClone[0].outerHTML;

            zip.file( 'index.html', pageHeader + pageBody + pageFooter );

            callback();

         });

       } // end of buildIndex

   } // donwloadOva()

   function initPageScripts( $content, materiaObj ) {

      $('.input-test input[type="text"]').on('input', function(){

         $(this).removeClass('verified');

      });

      var $pdf = $('.pdf-pro-plugin');

      if ( $pdf.length ) {

         PDFViewerPro.addInstance($pdf.get(0));

      }

      var $endBtt = $content.find('.end-btt');

      if ( $endBtt.parents('.tab').find('.owl-carousel').length ) $endBtt.children('img').attr('src', 'img/next-btt.png');

      var owl = $content.find('.tab:not(:last-child)').find('.owl-carousel').owlCarousel({
       items: 1,
       nav: true,
       autoHeight:true,
       mouseDrag: false
      });

      var owl = $content.find('.tab:last-child').find('.owl-carousel').owlCarousel({
       items: 1,
       nav: false,
       autoHeight:true,
       mouseDrag: false
      });

      owl.on('changed.owl.carousel', function(event) {

         if ( materiaObj.owlFunctions ) materiaObj.owlFunctions( event );

         var $owl = $(event.target),
             $endBtt = $owl.parents('.tab').find('.end-btt');

         if ( $endBtt.length ) {

            if ( event.item.index + 1 < event.item.count ) {

               $endBtt.children('img').attr('src', 'img/next-btt.png');

            } else {

               $endBtt.children('img').attr('src', 'img/end-btt.png');

            }

         }

      });

      var $sopas = $content.find('.spg-container');

      if ( $sopas.length ) {

       $sopas.each(function(){

          setSopa( $(this) )

       });

      }

      var $sortableTable = $content.find('.sortable-table');

      if ( $sortableTable.length ) {

         var $sortContainers = $sortableTable.find('.sortable-list');

         $sortContainers.each(function(){

            var $sortContainer = this;

            var sortable = Sortable.create($sortContainer, {
               onUpdate: function (evt){

                  var $parent = $( evt.from ),
                       elems = [];

                  $parent.children().each(function(){

                     var $this = $(this);

                     $this.removeClass('verified');

                     elems.push( $(this).data('order') * 1 );

                  });

                  if ( checkOrderedArrElm(elems) ) {

                     $parent.parent('.sortable-table').addClass('completed');

                  } else {

                     $parent.parent('.sortable-table').removeClass('completed');

                  }

               }
            });

         });

      }

      var $icfes = $content.find('.icfes-wrapper');

      if ( $icfes.length ) {

         $icfes.find('.car-item:not(.open-question):not(.not-question) .options > div').on('click', function(){

            var $this = $(this),
                 $question = $this.parents('.car-item');

            $this.addClass('selected').siblings().removeClass('selected');

            if ( $this.hasClass('answer') ) {

               $question.addClass('correct');

            } else {

               $question.removeClass('correct');

            }

         });

      }

      var $multiSel = $content.find('.multi-sel-opt');

      if ( $multiSel.length ) {

         $multiSel.children().on('click', function(){

            var $this = $(this);

            $this.toggleClass('selected');

            if ( $this.parent().hasClass('unique-opt') ) $this.siblings().removeClass('selected');

         });

      }

      var $dragDrop = $content.find('.drag-drop');

      if ( $dragDrop.length ) {

         $dragDrop.each(function(){

            App.init( $(this) )

         });

      }

      var $crossword = $content.find('.crw-container');

      if ( $crossword.length ) {

         new crossWord( $crossword, {
            size: 16,
            shuffle: true
         });

      }

      var $clickableSpots = $content.find('.clickable-spots');

      if ( $clickableSpots ) {

         $clickableSpots.each(function(){

            var $container = $(this);

            $container.find('.spot').each(function(){

               var $this = $(this),
                    $infoPanel;

               $container.find('.info > div').each(function(){

                  if ( $(this).data('spot') == $this.data('info') ) $infoPanel = $(this);

               });

               $this.on('click', function(){

                  swal({
                     title: $infoPanel.data('title'),
                     html: $infoPanel.html(),
                     confirmButtonText: 'Volver'
                  });

               });

            });

         });

      }

      var $displace = $content.find('.displace-wrapper');

      if ( $displace.length ) {

         $displace.each(function(){

            App.init( $(this) );

         });

      }

   }

   $( window ).on('load', function() {

      //console.log('win load!');

      if ( !pageLoaded ) {

         pageLoaded = true;

         if ( !staticPage ) navigate();

      }

   });

   setTimeout(function(){

      if ( !pageLoaded ) {

         pageLoaded = true;

         if ( !staticPage ) navigate();

      }

   }, 5000);

   $('.main-wrapper nav li').on('click', function(){

      var $this = $(this),
          scrollTop = $html.scrollTop();

      $this.addClass('active').siblings().removeClass('active');

      if ( scrollTop > 0 ) {

         $('html, body').animate({
            scrollTop: 0
         }, 300, function(){

            changePanel( $this );

         });

      } else {

         changePanel( $this );

      }

   });

   function changePanel( $this ) {

      var index = $this.index(),
          $mainWrapper = $this.parents('.main-wrapper');

      $mainWrapper.find('.tab.active').fadeOut( function(){

         $mainWrapper.find('.subtitle').html( $this.text() );

         $(this).removeClass('active')

         $mainWrapper.find('.tab').eq( index ).fadeIn( function(){

            $(this).addClass('active');

            window.dispatchEvent(new Event('resize'));

         });

      });

   }

   $body.on('mouseenter', '.rollover-numeros > text', function(e){

      var $this = $(this),
          index = $this.index() + 1,
          $panels = $this.parents('.row').find('.rollover-info > div'),
          $lines = $this.parents('.row').find('.rollover-lines > *');

      $this.addClass('active').siblings().removeClass('active');

      $panels.removeClass('active').hide();
      $panels.eq( index ).addClass('active').show();
      $lines.eq( index - 1 ).addClass('active').siblings().removeClass('active');

   });

   $('.start-btt').on('click', function(){

      currentGrade = $('.grade-sel').val() * 1;

      window.location.hash = currentGrade;

   });

   $('.mats-btt').on('click', function(){

      var currentGrade = getPostArray()[0];

      window.location.hash = currentGrade;

   });

   $('.program-btt').on('click', function(){

      var post = getPostArray();

      window.location.hash = post[0] + '/' + post[1];

   });

   $('.mat-wrapper > div').on('click', function(){

      var materia = $(this).find('h2').text();

      var post = getPostArray();

      window.location.hash = post[0] + '/' + encodeOvaUrl(materia) ;

   });

   function encodeOvaUrl( str ) {

      return str.replace(/ /g, "-")
                .replace(/á/g, "a")
                .replace(/é/g, "e")
                .replace(/í/g, "i")
                .replace(/ó/g, "o")
                .replace(/ú/g, "u")
                .replace(/Á/g, "a")
                .replace(/É/g, "e")
                .replace(/Í/g, "i")
                .replace(/Ó/g, "o")
                .replace(/Ú/g, "u")
                .replace(/ñ/g, "n")
                .toLowerCase();

   }

   function decodeOvaUrl( str ) {

      return str.replace(/-/g, " ")
                .replace(/\+a/g, "á")
                .replace(/\+e/g, "é")
                .replace(/\+i/g, "í")
                .replace(/\+o/g, "ó")
                .replace(/\+u/g, "ú");

   }

   $body.on('click', '.ver-unidad', function(){

      var $this = $(this),
          post = getPostArray();

      window.location.hash = post[0] + '/' + post[1] + '/' + encodeOvaUrl( $this.parents('li').data('materia') );

   });

   $body.on('click', '.next-btt', function(e){

      var index = $(this).parents('.tab').index();

      $('.main-wrapper nav li').eq( index + 1 ).trigger('click');

   });

   $body.on('click', '.end-btt', function(e){

      var $this = $(this),
          $mainWrapper = $this.parents('.main-wrapper'),
          $evalTab = $this.parents('.tab'),
          $finalOwl = $evalTab.find('.owl-carousel');


      if ( $finalOwl.length ) {

         var $dots = $finalOwl.find('.owl-dots > button'),
             owlActiveIndex = $finalOwl.find('.owl-dots > button.active').index();

       }

       var $evalDiv = $finalOwl.length ?
                      $evalTab.find('.owl-item').eq( owlActiveIndex ) :
                      $this.parents('.tab');

       if ( $finalOwl.length ) {

            if ( owlActiveIndex + 1 < $dots.length ) {

               if ( validation( $evalDiv ) ) {

                  $dots.eq( owlActiveIndex + 1 ).trigger('click');

               } else {

                  swal({
                    title: 'Vuelve a intentarlo!',
                    html: '<p>No todas las respuestas son correctas</p>',
                    type: 'error',
                    confirmButtonText: 'Volver'
                  });

               }

               return false;

            }

       }


      if ( !validation( $evalDiv ) ) {

         swal({
           title: 'Vuelve a intentarlo!',
           html: '<p>No todas las respuestas son correctas</p>',
           type: 'error',
           confirmButtonText: 'Volver'
         });

      } else {

         if ( $evalTab.is(':last-child') ) {

            var nombreMateria = $mainWrapper.find('.main-title').text();

            saveData.push( nombreMateria );

            localStorage.setItem("ovasPasto", JSON.stringify( saveData ) );

            $('.program li').each(function(){

               var $this = $(this);

               if ( $this.data('materia') == nombreMateria ) $this.addClass('completed')

            });

            swal({
              title: 'Felicitaciones!',
              html: '<p>Aprobaste esta unidad</p>',
              type: 'success',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.value) {

                $('.program-btt').trigger('click');

              }
            });

        } else {

           $('.main-wrapper nav li').eq( $evalTab.index() + 1 ).trigger('click');

        }

      }

   });

   function validation( $container ) {

      var errors = 0;

      var $inputTest = $container.find('.input-test');

      console.log( $container[0] );

      if ( $inputTest.length ) {

         console.log(errors);

         $inputTest.find('select').each(function(){

            var $this = $(this);

            if ( $this.val().toString() !==  $this.data('answer').toString() ) {

               $this.children().removeAttr('selected').first().attr('selected',true);

               errors++;

            } else {

               $this.addClass('verified');

            }

         });

         $inputTest.find('input').each(function(){

            var $this = $(this);

            if ( $this.val().toString().toLowerCase() !== $this.data('answer').toString().toLowerCase() ) {

               errors++;

               $this.removeClass('verified');

            } else {

               $this.addClass('verified');

            }

         });

      }

      var $sopa = $container.find('.spg-container');

      if ( $sopa.length ) {

         if ( !$sopa.hasClass('completed') ) errors++;

      }

      var $sortableTable = $container.find('.sortable-table');

      if ( $sortableTable.length ) {

         $sortableTable.find('.sortable-list li').each(function(){

            var $this = $(this);

            if ( $this.index() + 1 == $this.data('order') ) {

               $this.addClass('verified');

            } else {

               $this.removeClass('verified');

            }

         });

         if ( !$sortableTable.hasClass('completed') ) errors++;

      }

      var $icfes = $container.find('.options');

      if ( $icfes.length && $icfes.parents('.icfes-wrapper').length ) {

         console.log('icfes');

         var $caritem = $container.find('.car-item');

         $caritem.each(function(){

            var $this = $(this);

            if ( !$this.hasClass( 'not-question' ) ) {

               if ( !$this.hasClass('correct') ) {

                  console.log('wat');

                  $icfes.find('.selected').removeClass('selected');

                  errors++;

               }

            }

         });

      }

      var $multiSel = $container.find('.multi-sel-opt');

      if ( $multiSel.length ) {

         $multiSel.children().each(function(){

            var $this = $(this);

            if ( $this.hasClass('answer') ) {

               if ( !$this.hasClass('selected') ) errors++;

            } else {

               if ( $this.hasClass('selected') ) {

                  $this.removeClass('selected');

                  errors++;

               }

            }

         });

      }

      var $dragDrop = $container.find('.drag-drop, .displace-wrapper');

      if ( $dragDrop ) {

         console.log(errors);

         $dragDrop.find('.holders-wrapper .dd-holder').each(function(){

            var $this = $(this),
                $childs = $this.find('.dd-box'),
                corrects = 0;

            console.log( this );

            if ( $childs.length ) {

               $childs.each(function(){

                  if ( $this.data('holder') !== $(this).data('box') ) {

                     errors++;

                     console.log('wat');

                     $dragDrop.find('.boxes-wrapper').append( $(this) );

                  } else {

                     corrects++;

                     console.log('correct');

                  }

               });

            } else {

               if ( !$this.hasClass('empty-holder') ) {

                  console.log('wat');

                  errors++;

               }

            }

            var dataSlots = $this.data('slots');

            if ( dataSlots ) {

               console.log( corrects );

               if ( corrects < dataSlots ) {

                  console.log('wat');

                  errors++;

               }

            }

            console.log(errors);

         });

         console.log(errors);

      }

      var $crossword = $container.find('.crw-container');

      if ( $crossword.length ) {

         $crossword.find('.crw-grid > div.full').each(function(){

            var $input = $(this).find('input');

            if ( $input.val().toLowerCase() !== $input.data('letter').toLowerCase() ) errors++;

         });

      }

      if ( errors ) return false;

      return true;

   }

   console.log( 'Ovas totales:' + ovasDB.length );

   function getMateria( nombre ) {

      for (var i = 0; i < ovasDB.length; i++) {

         if ( encodeOvaUrl(ovasDB[i].nombre) == nombre ) return ovasDB[i];

      }

   }

   function randomString(howmanyChars) {
      var text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";

      for( var i=0; i < howmanyChars; i++ )
           text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
   }

   function setSopa( $container ) {

		var $sopa = $container.find('.spg-sopa'),
			 $words = $container.find('.spg-words'),
			 wordList = [],
          size = 16,
			 sopaString = randomString( size * size ),
			 tempWord,
          ocupedSlots = [],
			 crossed = 0;

      $words.find('li').each(function(){

         wordList.push( $(this).text().toLowerCase().replace(/ /g, "") );

      });

      for (var i = 0; i < wordList.length; i++) {

         insertWord( wordList[i] );

      }

		for (var i = 0; i < sopaString.length; i++) {

			$sopa.append('<span style="width:'+(100/size)+'%;height:'+(100/size)+'%;" class="letter"><span>' + sopaString[i] + '</span></span>');

		}

      $('<div class="sopa-tooltip">Para seleccionar las palabras haga click sostenido y arrastre el cursor</div>').insertAfter( $sopa );

		$sopa.on('mousedown', function(){

			$sopa.addClass('mousedown');

		});

		$sopa.on('mouseup', function(){

			$sopa.removeClass('mousedown');

			var wordIndex = wordList.indexOf( tempWord );

			if ( wordIndex > -1 ) {

				$sopa.find('.selected').addClass('crossed');

				$words.find('li').eq( wordIndex ).addClass('crossed').css('text-decoration', 'line-through');

				crossed++;

				if ( crossed == wordList.length ) {

               $container.addClass('completed');

				}

			}

			$sopa.find('.selected').removeClass('selected');

		});

		$sopa.on('mouseenter', '.letter', function(){

			if ( $sopa.hasClass('mousedown') ) {

				selectWord( this );

			}

		});

		$sopa.on('mousedown', '.letter', function(){

			tempWord = '';

			selectWord( this );

		});

		function selectWord( el ) {

			var $this = $(el);

			$this.addClass('selected');

			tempWord += $this.text();

		}

      function insertWord( word ) {

         var maxPos = size * size,
             randPos = getRandomInt(0, maxPos),
             direction = Math.random() > 0.5 ? 'h' : 'v';

         if ( isThereSlot( randPos, word, direction ) ) {

            if ( direction == 'h' ) {

               for (var i = 0; i < word.length; i++) {

                  sopaString = setCharAt( sopaString , randPos + i, word[i]);

                  ocupedSlots.push( randPos + i );

               }

            } else {

               for (var i = 0; i < word.length; i++) {

                  var letterPos = randPos + (i*size);

                  sopaString = setCharAt( sopaString , letterPos, word[i]);

                  ocupedSlots.push( letterPos );

               }

            }

         } else {

            insertWord( word );

         }

      }

      function isThereSlot( start, word, dir ) {

         if ( dir == 'h' ) {

            var avalaiblePos = size - (start % size);

            for (var i = 0; i < word.length; i++) {

               if ( ocupedSlots.indexOf( start + i ) > -1 ) return false;

            }

            return avalaiblePos >= word.length

         } else {

            for (var i = 0; i < word.length; i++) {

               var letterPos = start + (i*size);

               if ( ocupedSlots.indexOf( letterPos ) > -1 || letterPos > sopaString.length ) return false

            }

            return true

         }

      }

      function setCharAt(str,index,chr) {
          if(index > str.length-1) return str;
          return str.substr(0,index) + chr + str.substr(index+1);
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

	};

   var $brazoLeft = $('#char-left .brazo'),
       $brazoRight = $('#char-right .brazo');

   TweenLite.set( $brazoLeft, {transformOrigin:"0 0"} );
   TweenMax.fromTo( $brazoLeft, 1, {rotation:6}, {rotation: -12, yoyo: true, repeat:-1, ease: Power1.easeInOut});

   TweenLite.set( $brazoRight, {transformOrigin:"right top"} );
   TweenMax.fromTo( $brazoRight, 1, {rotation:15}, {rotation: 0, yoyo: true, repeat:-1, ease: Power1.easeInOut});

   function checkOrderedArrElm(list, des) {
       "use strict"; // optional.
       // --------------------------------------------
       // a is the array input to be tested.
       // --------------------------------------------
       // b is optional.
       // Undefined b (or other value besides 1) for ascending sequence.
       // b === 1 for descending sequence test.
       // --------------------------------------------
       var m = 0; // counter for loop.
       var current_num;
       var next_num;
       var result = list;
       var test;
       if (list !== undefined) {
           if (list.constructor === Array) { // check if input a is array object.
               result = true;
               while (m < list.length) { // loop through array elements.
                   current_num = list[m];
                   next_num = list[m + 1];
                   if (typeof current_num === "number" &&
                           typeof next_num === "number") {
                       if (des === 1) {
                           test = current_num <= next_num; // descending.
                       } else {
                           test = current_num >= next_num; // ascending.
                       }
                       if (test) { // found unordered/same elements.
                           result = false;
                           break;
                       }
                   }
                   m += 1;
               }
           }
       }
       return result;
   }

});

class App {

  static init( $wrapper ) {

    console.log('init');

    const boxes = $wrapper[0].getElementsByClassName('dd-box')

    for( const box of boxes ) {
      box.addEventListener("dragstart", App.dragstart)
      box.addEventListener("dragend", App.dragend)
    }

    $wrapper.find('.dd-holder').add( $wrapper.find('.boxes-wrapper') ).each(function(){

      this.addEventListener("dragover", App.dragover)
      this.addEventListener("dragenter", App.dragenter)
      this.addEventListener("dragleave", App.dragleave)
      this.addEventListener("drop", App.drop)

    });

  }

  static dragstart() {
     console.log('drag start');
    this.className += " dd-held"

    var thisevent = this;

    setTimeout(function(){
      $(thisevent).removeClass('dd-box dd-held').addClass('dd-invisible');
    }, 0)
  }

  static dragend() {
    $(this).addClass('dd-box').removeClass('dd-held dd-invisible');
  }

  static dragover(e) {
    e.preventDefault()
  }

  static dragenter(e) {
    e.preventDefault()
    this.className += " dd-hovered"
  }

  static dragleave(e) {
     if ( $(e.relatedTarget).hasClass('dd-box') || $(e.target).hasClass('dd-box') ) return false;

     $(this).addClass('dd-holder').removeClass('dd-hovered');
  }

  static drop() {

    var $$beignDragged = document.getElementsByClassName('dd-invisible')[0],
        $currentChilds = $(this).children('.dd-box');

    if ( $currentChilds.length && $(this).hasClass('unique-holder') ) {

      $currentChilds.insertAfter( $($$beignDragged) );

    }

    $(this).addClass('dd-holder ').removeClass('dd-hovered');
    this.prepend( $$beignDragged );
  }

}

// Fn to allow an event to fire after all images are loaded
$.fn.imagesLoaded = function () {

    // get all the images (excluding those with no src attribute)
    var $imgs = this.find('img[src!=""]');
    // if there's no images, just return an already resolved promise
    if (!$imgs.length) {return $.Deferred().resolve().promise();}

    // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
    var dfds = [];
    $imgs.each(function(){

        var dfd = $.Deferred();
        dfds.push(dfd);
        var img = new Image();
        img.onload = function(){dfd.resolve();}
        img.onerror = function(){dfd.resolve();}
        img.src = this.src;

    });

    // return a master promise object which will resolve when all the deferred objects have resolved
    // IE - when all the images are loaded
    return $.when.apply($,dfds);

}
