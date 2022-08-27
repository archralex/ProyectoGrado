var crossWord = function crossWord( $container, options ) {

   this.words = [];
   this.options = options;
   this.slots = [];
   this.$container = $container;
   this.init();
   this.prevDir = false;

}

crossWord.prototype = {

    init: function () {

       var proto = this;

       proto.$container.find('.crw-wordlist li').each(function(){
          proto.words.push( $(this).text().replace(/ /g, "") );
       });

       proto.arrange()

       proto.draw()

    }, // this.init()

    setSlots: function() {

       this.slots = [];

       for (var i = 0; i < this.options.size * this.options.size; i++) {
         this.slots.push(-1);
       }

    },

    arrange: function () {

       var proto = this,
           rowSize = proto.options.size;

       if ( proto.options.shuffle ) proto.words = shuffle(proto.words)
       proto.setSlots()
       proto.placedWords = []

       var maxPos = proto.slots.length;

       for (var i = 0; i < proto.words.length; i++) {

          if ( proto.placedWords.length ) {

               placedLoop:
               for (var j = 0; j < proto.placedWords.length; j++) {

                  var placedWord = proto.placedWords[j].word;

                  for (var k = 0; k < placedWord.length; k++) {

                     var placedLetter = placedWord.charAt(k);

                     for (var l = 0; l < proto.words[i].length; l++) {

                        var protoLetter = proto.words[i].charAt( l );

                        if ( placedLetter === protoLetter ) {

                           var placedStart = proto.placedWords[j].start,
                               placedDir = proto.placedWords[j].direction,
                               start = placedDir === 'h' ? ( placedStart + k ) - ( rowSize * l ) : ( placedStart + ( rowSize * k) ) -  l,
                               dir = placedDir === 'h' ? 'v' : 'h';

                           if ( isThereSlot( start, proto.words[i], dir ) ) {

                              insertWord( start, proto.words[i], dir )

                              break placedLoop;

                           }

                        }

                     }

                  }

               }

          } else {

             do {

                var startPoint = getRandomInt(0, maxPos)

             }
             while ( !isThereSlot( startPoint, proto.words[i], startPoint % 2 ? 'h' : 'v' ) );

             insertWord( startPoint, proto.words[i], startPoint % 2 ? 'h' : 'v' )

          }

       }

       if ( proto.placedWords.length < proto.words.length ) proto.arrange()

       function insertWord( initialPos, word, direction ) {

          for (var i = 0; i < word.length; i++) {

             var letterPos = direction == 'h' ? initialPos + i : initialPos + (i*rowSize),
                 crossed = false, crossedIndex = false;

             if ( proto.slots[ letterPos ] !== -1 ) {

                crossed = proto.slots[ letterPos ].word;
                crossedIndex = proto.slots[ letterPos ].letterIndex;

             }

             proto.slots[ letterPos ] = {
                word: word,
                letter: word[i],
                direction: direction,
                letterIndex: i
             }

             if ( crossed ) {

                proto.slots[ letterPos ].crossed = crossed;
                proto.slots[ letterPos ].crossedIndex = crossedIndex;

             }

          }

          proto.placedWords.push({
             word: word,
             direction: direction,
             start: initialPos
          })

       } // insertword()

       function isThereSlot( start, word, dir ) {

         var avalaiblePos = rowSize - (start % rowSize),
             crossed = false;

         for (var i = 0; i < word.length; i++) {

            var letterPos = dir == 'h' ? start + i : start + (i * rowSize),
                currentSlot = proto.slots[letterPos],
                siblingLess = dir == 'h' ? letterPos - rowSize : letterPos - 1,
                siblingMore = dir == 'h' ? letterPos + rowSize : letterPos + 1,
                beforeWord = dir == 'v' ? letterPos - rowSize : letterPos - 1,
                afterWord = dir == 'v' ? letterPos + rowSize : letterPos + 1;

            // return false if there is no room (h)
            if ( avalaiblePos < word.length && dir == 'h' ) return false

            // return false if there is no room (v)
            if ( letterPos > maxPos && dir == 'v') return false

            if ( currentSlot !== -1 ) {

               // return false if the slot is taken by a different letter
               if ( currentSlot ) if ( currentSlot.letter !== word[i] ) return false

            }

            // return false if the slot is free but siblings are taken
            if ( currentSlot === -1 && ( proto.slots[siblingLess] !== -1 || proto.slots[siblingMore] !== -1 ) ) return false

            // return false if the slot before the first letter is taken
            if ( i === 0 && proto.slots[beforeWord] !== -1 ) return false

            // return false if the slot after the last letter is taken
            if ( i === word.length - 1 && proto.slots[afterWord] !== -1 ) return false

         }

         return true

       } // isThereSlot()

       function shuffle(array) {

           var currentIndex = array.length, temporaryValue, randomIndex;

           // While there remain elements to shuffle...
           while (0 !== currentIndex) {

             // Pick a remaining element...
             randomIndex = Math.floor(Math.random() * currentIndex);
             currentIndex -= 1;

             // And swap it with the current element.
             temporaryValue = array[currentIndex];
             array[currentIndex] = array[randomIndex];
             array[randomIndex] = temporaryValue;
           }

           return array;
        } // shuffle()

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        } // getRandomInt()

    }, // this.arrange()

   draw: function() {

      var proto = this,
          rowSize = proto.options.size,
          $grid = this.$container.find('.crw-grid');

      for (var i = 0; i < proto.slots.length; i++) {

         var $cell = $('<div style="width:'+(100/rowSize)+'%;height:'+(100/rowSize)+'%;" />');

         if ( proto.slots[i] !== -1 ) {

            var letterObj = proto.slots[i],
                $input = $('<input maxlength="1" '+
                              'data-word="'+ letterObj.word
                           +'" data-direction="'+ letterObj.direction
                           +'" data-letter="'+ letterObj.letter
                           +'" type="text" />')

            if ( letterObj.crossed ) $input.attr('data-crossed', letterObj.crossed);

            $cell.addClass('direction-' + letterObj.direction);

            $cell.html( $input );

            if ( letterObj.letterIndex == 0 ) {

               $cell.addClass('direction-' + letterObj.direction + '-init');

               $cell.append( '<svg data-word="'+ letterObj.word +'" version="1.1" class="direction-'+ letterObj.direction  +'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 24 24" style="enable-background:new -290 382 24 24;" xml:space="preserve"> <path d="M-278,382c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S-271.4,382-278,382z M-277,400h-2v-7h2V400z M-278,390.5 c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S-277.2,390.5-278,390.5z"/> </svg>' );

            }

            if ( letterObj.crossed ) {

               if ( letterObj.crossedIndex == 0 ) {

                  var crossedDir = letterObj.direction === 'h' ? 'v' : 'h';

                  $cell.addClass('direction-' + crossedDir + '-init');

                  $cell.append( '<svg version="1.1" data-word="'+ letterObj.crossed +'" class="direction-'+ crossedDir  +'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-290 382 24 24" style="enable-background:new -290 382 24 24;" xml:space="preserve"> <path d="M-278,382c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S-271.4,382-278,382z M-277,400h-2v-7h2V400z M-278,390.5 c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S-277.2,390.5-278,390.5z"/> </svg>' );

               }

            }

            $cell.addClass('full');

            $cell.find('svg').on('click', function(e){
               $(this).siblings('input').focus();
               proto.prevDir = $(this).hasClass('direction-h') ? 'h' : 'v';
            });

            $cell.find('svg').each(function(){

               var $svg = $(this),
                   content = null;

               proto.$container.find('.crw-clues > div').each(function(){
                  if ( $(this).data('word') === $svg.data('word') ) content = $(this).text()
               })

               tippy(this, {
                  content: content,
                  placement: $svg.hasClass('direction-h') ? 'left' : 'top',
                  delay: 100,
                  flip: false,
                  arrow: true,
                  interactive: true,
                  size: 'small',
                  duration: 300,
                  animation: 'shift-toward'
               })
            });

            $input.on('click', function(e){
               proto.prevDir = false;
            });

            $input.on('keydown', function(e){
               $(this).val('');
            });

            $input.on('keyup', function(e){

               var KeyID = e.keyCode,
                   $this = $(this),
                   back = KeyID == 8 || KeyID == 46,
                   currentIndex = $this.parent('div').index(),
                   nextDir = proto.prevDir || $this.data('direction'),
                   nextIndex = nextDir == 'h' ? back ? currentIndex - 1 : currentIndex + 1 : back ? currentIndex - rowSize : currentIndex + rowSize,
                   nextInput = $this.parents('.crw-grid').children().eq( nextIndex ).children('input');

               if ( nextInput ) {

                  nextInput.focus();

                  proto.prevDir = nextDir;

               } else {

                  proto.prevDir = false;

               }

            });

         }

         $grid.append( $cell );

      }

      function isLowerCase(str){
          return str == str.toLowerCase() && str != str.toUpperCase();
      }

   } // proto.draw()

} // proto
