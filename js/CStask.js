// Generated by CoffeeScript 1.6.3
(function() {
  var Block, IBI, ITI, Session, Trial, blockFactory, blocks, c, clear_canvas, ctx, data, height, instructions, livingPrac, mean, mixedBlock, multilineText, saveData, sizePrac, trialFactory, trialLength, width;

  livingPrac = [["alligator", "living"], ["snowflake", "living"], ["bicycle", "living"], ["mushroom", "living"], ["cloud", "living"], ["goldfish", "living"], ["lizard", "living"], ["table", "living"], ["marble", "living"], ["shark", "living"], ["knob", "living"], ["lion", "living"]];

  sizePrac = [["table", "size"], ["knob", "size"], ["pebble", "size"], ["oak", "size"], ["bicycle", "size"], ["coat", "size"], ["shark", "size"], ["lizard", "size"], ["alligator", "size"], ["lion", "size"], ["snowflake", "size"], ["bicycle", "size"], ["shark", "size"], ["lizard", "size"]];

  mixedBlock = [["sparrow", "size"], ["table", "living"], ["lion", "size"], ["sparrow", "living"], ["cloud", "living"], ["alligator", "size"], ["lizard", "size"], ["marble", "living"], ["table", "size"], ["pebble", "size"], ["shark", "living"], ["coat", "living"], ["alligator", "living"], ["pebble", "size"], ["lion", "living"], ["snowflake", "living"], ["lizard", "living"]];

  blocks = [["livingOnly", "Get ready to begin... Only living or non-living", livingPrac], ["sizeOnly", "Get ready for mre trials... Only size trials", sizePrac], ["mixed", "Get ready for more trials... this is a mixed block", mixedBlock]];

  trialLength = 3500;

  ITI = 1000;

  IBI = 4000;

  instructions = ["In each trial of this task, you will see a word that appears with a symbol above it. \n\nWhen the symbol is   " + String.fromCharCode(10084) + "  you should decide if \nthe word describes something that is, or could have ever been living, or nonliving.\n\nWhen the symbol is   " + String.fromCharCode(10021) + "  you should decide if \nthe word describes something that is smaller or bigger than a soccer ball. \n\nPress the arrow to continue \n", "The words that describe NON-LIVING things are: \nsnowflake, pebble, marble, knob, bicycle, coat, table, and cloud. \n\nThe words that describe LIVING things are: \nsparrow, mushroom, lizard, goldfish, lion, shark, alligator, and oak. \n\nThe words that describe SMALL things are: \nsnowflake, pebble, marble, knob, sparrow, mushroom, lizard, and goldfish. \n\nThe words that describe BIG things are: \nbicycle, coat, table, cloud, lion, shark, alligator, and oak. \n\nPress the right arrow to continue.\n", "If the item is NON-living press 'F' \n\nIf the item is living, press 'J' \n\nIf the item is smaller than soccer ball press 'F' \n\nIf the item is bigger than soccer ball press 'J' \n\n"];

  c = document.getElementById("canvas");

  ctx = c.getContext("2d");

  width = canvas.width;

  height = canvas.height;

  data = [];

  saveData = function(newdata) {
    return data.push([newdata]);
  };

  mean = function(numericArray) {
    var avg, sum;
    sum = numericArray.reduce(function(a, b) {
      return a + b;
    });
    avg = sum / numericArray.length;
    return avg;
  };

  clear_canvas = function() {
    return ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  multilineText = function(txt, x, y, font, lineheight, clear) {
    var i, lines, _results;
    if (lineheight == null) {
      lineheight = 20;
    }
    if (clear == null) {
      clear = true;
    }
    if (clear) {
      clear_canvas();
    }
    ctx.font = font;
    console.log(font);
    console.log(ctx.font);
    if (x === "center") {
      ctx.textAlign = "center";
      x = canvas.width / 2;
    }
    if (y === "center") {
      y = canvas.height / 2;
    }
    lines = txt.split('\n');
    i = 0;
    _results = [];
    while (i < lines.length) {
      ctx.fillText(lines[i], x, y + (i * lineheight));
      _results.push(i++);
    }
    return _results;
  };

  Session = (function() {
    function Session(blocks_in) {
      this.blocks_in = blocks_in;
      this.blockNumber = 0;
      this.max_blocks = this.blocks_in.length;
      this.blocks = blockFactory(this.blocks_in);
    }

    Session.prototype.start = function() {
      $(".btn").css({
        'visibility': 'hidden'
      });
      return this.nextBlock();
    };

    Session.prototype.startInstructions = function() {
      this.inst_num = 0;
      return this.nextInstruction();
    };

    Session.prototype.nextInstruction = function() {
      if (this.inst_num > 0) {
        $('#prev').css({
          'visibility': 'visible'
        });
      }
      if (this.inst_num < instructions.length) {
        multilineText(instructions[this.inst_num], 10, 30, "20px Arial", 30);
        return this.inst_num += 1;
      } else {
        return this.start();
      }
    };

    Session.prototype.prevInstruction = function() {
      this.inst_num = this.inst_num - 2;
      if (this.inst_num === 0) {
        $('#prev').css({
          'visibility': 'visible'
        });
      }
      multilineText(instructions[this.inst_num], 10, 30, "20px Arial", 30);
      return this.inst_num += 1;
    };

    Session.prototype.nextBlock = function() {
      var _this = this;
      this.currBlock = this.blocks[this.blockNumber];
      if (this.blockNumber >= this.max_blocks) {
        return this.endSession();
      } else {
        this.blockNumber++;
        return this.currBlock.start((function() {
          return _this.nextBlock();
        }));
      }
    };

    Session.prototype.endSession = function() {
      return $('#done').modal('show');
    };

    return Session;

  })();

  Block = (function() {
    function Block(condition, message, trials_in) {
      this.condition = condition;
      this.message = message;
      this.trials_in = trials_in;
      this.trialNumber = 0;
      this.max_trials = this.trials_in.length;
      this.trials = trialFactory(this.trials_in);
      this.data = [];
    }

    Block.prototype.start = function(endBlock) {
      var _this = this;
      this.endBlock = endBlock;
      multilineText(this.message, 10, 75, "25px Arial", 75);
      return setTimeout((function() {
        return _this.nextTrial();
      }), IBI);
    };

    Block.prototype.nextTrial = function() {
      var _this = this;
      this.currTrial = this.trials[this.trialNumber];
      if (this.trialNumber >= this.max_trials) {
        return this.feedback();
      } else {
        this.trialNumber++;
        return this.currTrial.show((function(arg1) {
          return _this.logTrial(arg1);
        }));
      }
    };

    Block.prototype.feedback = function() {
      var goodRTs, n,
        _this = this;
      goodRTs = [
        (function() {
          var _i, _len, _ref, _results;
          _ref = this.data;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            n = _ref[_i];
            _results.push(n[0]);
          }
          return _results;
        }).call(this)
      ][0];
      while (goodRTs.indexOf('NA') > -1) {
        goodRTs.splice(goodRTs.indexOf('NA'), 1);
      }
      multilineText("Your average reaction time was: " + mean(goodRTs).toString() + "ms", 10, 30, "20px Arial");
      return setTimeout((function() {
        return _this.endBlock();
      }), IBI);
    };

    Block.prototype.logTrial = function(trialData) {
      saveData([this.condition].concat(trialData));
      this.data.push(trialData);
      return this.nextTrial();
    };

    return Block;

  })();

  Trial = (function() {
    function Trial(item, judgment) {
      this.item = item;
      this.judgment = judgment;
      this.rt = 'NA';
      this.resp = 'NA';
    }

    Trial.prototype.show = function(endTrial) {
      var _this = this;
      multilineText(this.processJudgment(this.judgment), "center", canvas.height / 2 - 75, "40px Arial");
      multilineText(this.item, "center", "center", "35px Arial", 20, false);
      this.startTime = (new Date).getTime();
      setTimeout((function() {
        return clear_canvas();
      }), trialLength - ITI);
      return setTimeout((function() {
        return endTrial([_this.rt, _this.resp]);
      }), trialLength);
    };

    Trial.prototype.processJudgment = function(judgment) {
      var symbol;
      if (judgment === "living") {
        symbol = String.fromCharCode(10084);
      } else {
        symbol = String.fromCharCode(10021);
      }
      return symbol;
    };

    Trial.prototype.logResponse = function(resp) {
      this.rt = (new Date).getTime() - this.startTime;
      return this.resp = resp;
    };

    return Trial;

  })();

  trialFactory = function(trials) {
    var n, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = trials.length; _i < _len; _i++) {
      n = trials[_i];
      _results.push(new Trial(n[0], n[1]));
    }
    return _results;
  };

  blockFactory = function(blocks) {
    var n, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = blocks.length; _i < _len; _i++) {
      n = blocks[_i];
      _results.push(new Block(n[0], n[1], n[2]));
    }
    return _results;
  };

  jQuery(function() {
    var currSession;
    currSession = new Session(blocks);
    currSession.startInstructions();
    $("#next").click(function() {
      return currSession.nextInstruction();
    });
    $("#prev").click(function() {
      return currSession.prevInstruction();
    });
    return $(document).keypress(function(event) {
      return currSession.currBlock.currTrial.logResponse(String.fromCharCode(event.keyCode));
    });
  });

}).call(this);
