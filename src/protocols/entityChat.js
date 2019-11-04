(function() {
  'use strict';

  var extend = function (destination, source) {
    if (!destination || !source) return destination;
    for (var key in source) {
      if (destination[key] !== source[key])
        destination[key] = source[key];
    }
    return destination;
  };

  var formatError = function (input, offset, expected) {
    var lines = input.split(/\n/g),
        lineNo = 0,
        position = 0;

    while (position <= offset) {
      position += lines[lineNo].length + 1;
      lineNo += 1;
    }
    var message = 'Line ' + lineNo + ': expected ' + expected.join(', ') + '\n',
        line = lines[lineNo - 1];

    message += line + '\n';
    position -= line.length + 1;

    while (position < offset) {
      message += ' ';
      position += 1;
    }
    return message + '^';
  };

  var inherit = function (subclass, parent) {
    var chain = function() {};
    chain.prototype = parent.prototype;
    subclass.prototype = new chain();
    subclass.prototype.constructor = subclass;
  };

  var TreeNode = function(text, offset, elements) {
    this.text = text;
    this.offset = offset;
    this.elements = elements || [];
  };

  TreeNode.prototype.forEach = function(block, context) {
    for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
      block.call(context, el[i], i, el);
    }
  };

  var TreeNode1 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['speechAct_create'] = elements[0];
    this['__'] = elements[5];
    this['entityType'] = elements[2];
    this['entityId'] = elements[4];
    this['entityText'] = elements[6];
  };
  inherit(TreeNode1, TreeNode);

  var TreeNode2 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['speechAct_update'] = elements[0];
    this['__'] = elements[3];
    this['entityType'] = elements[2];
    this['entityId'] = elements[4];
  };
  inherit(TreeNode2, TreeNode);

  var TreeNode3 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['speechAct_join'] = elements[0];
    this['__'] = elements[3];
    this['entityType_join'] = elements[2];
    this['entityId'] = elements[4];
  };
  inherit(TreeNode3, TreeNode);

  var TreeNode4 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['speechAct_invite'] = elements[0];
    this['__'] = elements[3];
    this['entityType_invite'] = elements[2];
    this['entityId'] = elements[4];
  };
  inherit(TreeNode4, TreeNode);

  var TreeNode5 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['speechAct_list'] = elements[0];
    this['__'] = elements[1];
    this['entityType'] = elements[2];
  };
  inherit(TreeNode5, TreeNode);

  var TreeNode6 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['speechAct_show'] = elements[0];
    this['__'] = elements[3];
    this['entityType'] = elements[2];
    this['entityId'] = elements[4];
  };
  inherit(TreeNode6, TreeNode);

  var FAILURE = {};

  var Grammar = {
    _read_message: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._message = this._cache._message || {};
      var cached = this._cache._message[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_msg_create();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_msg_update();
        if (address0 === FAILURE) {
          this._offset = index1;
          address0 = this._read_msg_join();
          if (address0 === FAILURE) {
            this._offset = index1;
            address0 = this._read_msg_invite();
            if (address0 === FAILURE) {
              this._offset = index1;
              address0 = this._read_msg_list();
              if (address0 === FAILURE) {
                this._offset = index1;
                address0 = this._read_msg_show();
                if (address0 === FAILURE) {
                  this._offset = index1;
                }
              }
            }
          }
        }
      }
      this._cache._message[index0] = [address0, this._offset];
      return address0;
    },

    _read_msg_create: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._msg_create = this._cache._msg_create || {};
      var cached = this._cache._msg_create[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(7);
      var address1 = FAILURE;
      address1 = this._read_speechAct_create();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_entityType();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read___();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              address5 = this._read_entityId();
              if (address5 !== FAILURE) {
                elements0[4] = address5;
                var address6 = FAILURE;
                address6 = this._read___();
                if (address6 !== FAILURE) {
                  elements0[5] = address6;
                  var address7 = FAILURE;
                  address7 = this._read_entityText();
                  if (address7 !== FAILURE) {
                    elements0[6] = address7;
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode1(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._msg_create[index0] = [address0, this._offset];
      return address0;
    },

    _read_speechAct_create: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._speechAct_create = this._cache._speechAct_create || {};
      var cached = this._cache._speechAct_create[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 6);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'create'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset);
        this._offset = this._offset + 6;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`create`');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 3);
        }
        if (chunk1 !== null && chunk1.toLowerCase() === 'add'.toLowerCase()) {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
          this._offset = this._offset + 3;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('`add`');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 7);
          }
          if (chunk2 !== null && chunk2.toLowerCase() === 'suggest'.toLowerCase()) {
            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
            this._offset = this._offset + 7;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('`suggest`');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
          }
        }
      }
      this._cache._speechAct_create[index0] = [address0, this._offset];
      return address0;
    },

    _read_msg_update: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._msg_update = this._cache._msg_update || {};
      var cached = this._cache._msg_update[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(5);
      var address1 = FAILURE;
      address1 = this._read_speechAct_update();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_entityType();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read___();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              address5 = this._read_entityId();
              if (address5 !== FAILURE) {
                elements0[4] = address5;
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode2(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._msg_update[index0] = [address0, this._offset];
      return address0;
    },

    _read_speechAct_update: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._speechAct_update = this._cache._speechAct_update || {};
      var cached = this._cache._speechAct_update[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 7);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'decline'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
        this._offset = this._offset + 7;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`decline`');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 7);
        }
        if (chunk1 !== null && chunk1.toLowerCase() === 'approve'.toLowerCase()) {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
          this._offset = this._offset + 7;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('`approve`');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 7);
          }
          if (chunk2 !== null && chunk2.toLowerCase() === 'discuss'.toLowerCase()) {
            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
            this._offset = this._offset + 7;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('`discuss`');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 6);
            }
            if (chunk3 !== null && chunk3.toLowerCase() === 'delete'.toLowerCase()) {
              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset);
              this._offset = this._offset + 6;
            } else {
              address0 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('`delete`');
              }
            }
            if (address0 === FAILURE) {
              this._offset = index1;
            }
          }
        }
      }
      this._cache._speechAct_update[index0] = [address0, this._offset];
      return address0;
    },

    _read_msg_join: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._msg_join = this._cache._msg_join || {};
      var cached = this._cache._msg_join[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(5);
      var address1 = FAILURE;
      address1 = this._read_speechAct_join();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_entityType_join();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read___();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              address5 = this._read_entityId();
              if (address5 !== FAILURE) {
                elements0[4] = address5;
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode3(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._msg_join[index0] = [address0, this._offset];
      return address0;
    },

    _read_speechAct_join: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._speechAct_join = this._cache._speechAct_join || {};
      var cached = this._cache._speechAct_join[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 4);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'join'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
        this._offset = this._offset + 4;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`join`');
        }
      }
      this._cache._speechAct_join[index0] = [address0, this._offset];
      return address0;
    },

    _read_entityType_join: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._entityType_join = this._cache._entityType_join || {};
      var cached = this._cache._entityType_join[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 4);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'team'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
        this._offset = this._offset + 4;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`team`');
        }
      }
      this._cache._entityType_join[index0] = [address0, this._offset];
      return address0;
    },

    _read_msg_invite: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._msg_invite = this._cache._msg_invite || {};
      var cached = this._cache._msg_invite[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(5);
      var address1 = FAILURE;
      address1 = this._read_speechAct_invite();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_entityType_invite();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read___();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              address5 = this._read_entityId();
              if (address5 !== FAILURE) {
                elements0[4] = address5;
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode4(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._msg_invite[index0] = [address0, this._offset];
      return address0;
    },

    _read_speechAct_invite: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._speechAct_invite = this._cache._speechAct_invite || {};
      var cached = this._cache._speechAct_invite[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 6);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'invite'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset);
        this._offset = this._offset + 6;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`invite`');
        }
      }
      this._cache._speechAct_invite[index0] = [address0, this._offset];
      return address0;
    },

    _read_entityType_invite: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._entityType_invite = this._cache._entityType_invite || {};
      var cached = this._cache._entityType_invite[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 6);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'member'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset);
        this._offset = this._offset + 6;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`member`');
        }
      }
      this._cache._entityType_invite[index0] = [address0, this._offset];
      return address0;
    },

    _read_msg_list: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._msg_list = this._cache._msg_list || {};
      var cached = this._cache._msg_list[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      address1 = this._read_speechAct_list();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_entityType();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            var index2 = this._offset;
            var chunk0 = null;
            if (this._offset < this._inputSize) {
              chunk0 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk0 !== null && chunk0.toLowerCase() === 's'.toLowerCase()) {
              address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address4 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('`s`');
              }
            }
            if (address4 === FAILURE) {
              address4 = new TreeNode(this._input.substring(index2, index2), index2);
              this._offset = index2;
            }
            if (address4 !== FAILURE) {
              elements0[3] = address4;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode5(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._msg_list[index0] = [address0, this._offset];
      return address0;
    },

    _read_speechAct_list: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._speechAct_list = this._cache._speechAct_list || {};
      var cached = this._cache._speechAct_list[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 4);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'list'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
        this._offset = this._offset + 4;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`list`');
        }
      }
      this._cache._speechAct_list[index0] = [address0, this._offset];
      return address0;
    },

    _read_msg_show: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._msg_show = this._cache._msg_show || {};
      var cached = this._cache._msg_show[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(5);
      var address1 = FAILURE;
      address1 = this._read_speechAct_show();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read___();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          address3 = this._read_entityType();
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read___();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              address5 = this._read_entityId();
              if (address5 !== FAILURE) {
                elements0[4] = address5;
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = new TreeNode6(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      }
      this._cache._msg_show[index0] = [address0, this._offset];
      return address0;
    },

    _read_speechAct_show: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._speechAct_show = this._cache._speechAct_show || {};
      var cached = this._cache._speechAct_show[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 4);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'show'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
        this._offset = this._offset + 4;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`show`');
        }
      }
      this._cache._speechAct_show[index0] = [address0, this._offset];
      return address0;
    },

    _read_entityType: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._entityType = this._cache._entityType || {};
      var cached = this._cache._entityType[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 7);
      }
      if (chunk0 !== null && chunk0.toLowerCase() === 'purpose'.toLowerCase()) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 7), this._offset);
        this._offset = this._offset + 7;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('`purpose`');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 4);
        }
        if (chunk1 !== null && chunk1.toLowerCase() === 'logo'.toLowerCase()) {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
          this._offset = this._offset + 4;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('`logo`');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 4);
          }
          if (chunk2 !== null && chunk2.toLowerCase() === 'name'.toLowerCase()) {
            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
            this._offset = this._offset + 4;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('`name`');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 11);
            }
            if (chunk3 !== null && chunk3.toLowerCase() === 'description'.toLowerCase()) {
              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 11), this._offset);
              this._offset = this._offset + 11;
            } else {
              address0 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('`description`');
              }
            }
            if (address0 === FAILURE) {
              this._offset = index1;
              var chunk4 = null;
              if (this._offset < this._inputSize) {
                chunk4 = this._input.substring(this._offset, this._offset + 5);
              }
              if (chunk4 !== null && chunk4.toLowerCase() === 'intro'.toLowerCase()) {
                address0 = new TreeNode(this._input.substring(this._offset, this._offset + 5), this._offset);
                this._offset = this._offset + 5;
              } else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('`intro`');
                }
              }
              if (address0 === FAILURE) {
                this._offset = index1;
                var chunk5 = null;
                if (this._offset < this._inputSize) {
                  chunk5 = this._input.substring(this._offset, this._offset + 3);
                }
                if (chunk5 !== null && chunk5.toLowerCase() === 'tag'.toLowerCase()) {
                  address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                  this._offset = this._offset + 3;
                } else {
                  address0 = FAILURE;
                  if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                  }
                  if (this._offset === this._failure) {
                    this._expected.push('`tag`');
                  }
                }
                if (address0 === FAILURE) {
                  this._offset = index1;
                  var chunk6 = null;
                  if (this._offset < this._inputSize) {
                    chunk6 = this._input.substring(this._offset, this._offset + 4);
                  }
                  if (chunk6 !== null && chunk6.toLowerCase() === 'tool'.toLowerCase()) {
                    address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
                    this._offset = this._offset + 4;
                  } else {
                    address0 = FAILURE;
                    if (this._offset > this._failure) {
                      this._failure = this._offset;
                      this._expected = [];
                    }
                    if (this._offset === this._failure) {
                      this._expected.push('`tool`');
                    }
                  }
                  if (address0 === FAILURE) {
                    this._offset = index1;
                    var chunk7 = null;
                    if (this._offset < this._inputSize) {
                      chunk7 = this._input.substring(this._offset, this._offset + 6);
                    }
                    if (chunk7 !== null && chunk7.toLowerCase() === 'member'.toLowerCase()) {
                      address0 = new TreeNode(this._input.substring(this._offset, this._offset + 6), this._offset);
                      this._offset = this._offset + 6;
                    } else {
                      address0 = FAILURE;
                      if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                      }
                      if (this._offset === this._failure) {
                        this._expected.push('`member`');
                      }
                    }
                    if (address0 === FAILURE) {
                      this._offset = index1;
                      var chunk8 = null;
                      if (this._offset < this._inputSize) {
                        chunk8 = this._input.substring(this._offset, this._offset + 4);
                      }
                      if (chunk8 !== null && chunk8.toLowerCase() === 'team'.toLowerCase()) {
                        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
                        this._offset = this._offset + 4;
                      } else {
                        address0 = FAILURE;
                        if (this._offset > this._failure) {
                          this._failure = this._offset;
                          this._expected = [];
                        }
                        if (this._offset === this._failure) {
                          this._expected.push('`team`');
                        }
                      }
                      if (address0 === FAILURE) {
                        this._offset = index1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this._cache._entityType[index0] = [address0, this._offset];
      return address0;
    },

    _read_entityId: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._entityId = this._cache._entityId || {};
      var cached = this._cache._entityId[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var index2 = this._offset, elements1 = new Array(2);
        var address2 = FAILURE;
        var index3 = this._offset;
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 === ' ') {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address2 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('" "');
          }
        }
        this._offset = index3;
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(this._offset, this._offset), this._offset);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements1[0] = address2;
          var address3 = FAILURE;
          if (this._offset < this._inputSize) {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('<any char>');
            }
          }
          if (address3 !== FAILURE) {
            elements1[1] = address3;
          } else {
            elements1 = null;
            this._offset = index2;
          }
        } else {
          elements1 = null;
          this._offset = index2;
        }
        if (elements1 === null) {
          address1 = FAILURE;
        } else {
          address1 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._entityId[index0] = [address0, this._offset];
      return address0;
    },

    _read_entityText: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._entityText = this._cache._entityText || {};
      var cached = this._cache._entityText[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        if (this._offset < this._inputSize) {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('<any char>');
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache._entityText[index0] = [address0, this._offset];
      return address0;
    },

    _read___: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache.___ = this._cache.___ || {};
      var cached = this._cache.___[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var remaining0 = 1, index1 = this._offset, elements0 = [], address1 = true;
      while (address1 !== FAILURE) {
        var index2 = this._offset;
        var chunk0 = null;
        if (this._offset < this._inputSize) {
          chunk0 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk0 === ' ') {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('" "');
          }
        }
        if (address1 === FAILURE) {
          this._offset = index2;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[\n\r\t]/.test(chunk1)) {
            address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address1 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[\\n\\r\\t]');
            }
          }
          if (address1 === FAILURE) {
            this._offset = index2;
          }
        }
        if (address1 !== FAILURE) {
          elements0.push(address1);
          --remaining0;
        }
      }
      if (remaining0 <= 0) {
        address0 = new TreeNode(this._input.substring(index1, this._offset), index1, elements0);
        this._offset = this._offset;
      } else {
        address0 = FAILURE;
      }
      this._cache.___[index0] = [address0, this._offset];
      return address0;
    }
  };

  var Parser = function(input, actions, types) {
    this._input = input;
    this._inputSize = input.length;
    this._actions = actions;
    this._types = types;
    this._offset = 0;
    this._cache = {};
    this._failure = 0;
    this._expected = [];
  };

  Parser.prototype.parse = function() {
    var tree = this._read_message();
    if (tree !== FAILURE && this._offset === this._inputSize) {
      return tree;
    }
    if (this._expected.length === 0) {
      this._failure = this._offset;
      this._expected.push('<EOF>');
    }
    this.constructor.lastError = {offset: this._offset, expected: this._expected};
    throw new SyntaxError(formatError(this._input, this._failure, this._expected));
  };

  var parse = function(input, options) {
    options = options || {};
    var parser = new Parser(input, options.actions, options.types);
    return parser.parse();
  };
  extend(Parser.prototype, Grammar);

  var exported = {Grammar: Grammar, Parser: Parser, parse: parse};

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.EntityChat = exported;
  }
})();
