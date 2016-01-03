/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        jqueryui: '//i2dcui.appspot.com/js/jquery-ui-1.10.4/ui/jquery.ui.core',
        jqueryuiWidget: '//i2dcui.appspot.com/js/jquery-ui-1.10.4/ui/jquery.ui.widget',
        jqueryuiMouse: '//i2dcui.appspot.com/js/jquery-ui-1.10.4/ui/jquery.ui.mouse',
        jqueryuiResizeable: '//i2dcui.appspot.com/js/jquery-ui-1.10.4/ui/jquery.ui.resizable',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
        jqueryuiWidget: ['jqueryui'],
        jqueryuiMouse: ['jqueryuiWidget'],
        jqueryuiResizeable: ['jqueryuiMouse' ]
    }
});

cprequire_test(["inline:com-chilipeppr-widget-terminal"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );
    
    // load spjs widget so we can test
    //http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/
    $('body').append('<div id="testDivForSpjsWidget"></div>');
    chilipeppr.load(
        "#testDivForSpjsWidget",
        "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
        function() {
            console.log("mycallback got called after loading spjs module");
            cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                //console.log("inside require of " + fm.id);
                spjs.init();
                spjs.consoleToggle();
                
                // init my widget
                myWidget.init();

            });
        }
    );
    
    $('#' + myWidget.id).css('margin', '10px');
    $('title').html(myWidget.name);

    
} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-terminal", ["chilipeppr_ready", "jqueryuiResizeable"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-terminal", // Make the id the same as the cpdefine id
        name: "Widget / Terminal", // The descriptive name of your widget.
        desc: "A terminal session with the host running SPJS. As of version 1.87 of SPJS you can send/receive basic terminal commands to host operating system. This widget is a front-end UI for the terminal from ChiliPeppr.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            
            "/com-chilipeppr-widget-serialport/ws/send" : "We send at a low-level on the socket the exec and execruntime command as a fundamental for this widget to work.",
            "/com-chilipeppr-widget-serialport/requestVersion" : 'We need to ask the Serial Port JSON Server widget to send us back the version, we receive it back on the /recvVersion signal.',
        "/com-chilipeppr-widget-serialport/requestStatus" : 'We need to request the status of the websocket to see if the Terminal can be used. We are sent back /recvStatus'
            
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            "/com-chilipeppr-widget-serialport/recvVersion" : 'When we ask the Serial Port JSON Server widget to send us back the version from the /requestVersion signal, we receive it back on this signal.',
            "/com-chilipeppr-widget-serialport/recvStatus" : 'When we ask for status via /requestStatus, we get a signal back with the payload of connected vs disconnected for the websocket.'
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            
            this.logSetup();
            this.consoleSetup();
            
            this.versionWarning();
            this.requestSpjsStatus();
            
            this.setupResizeable();

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();

            console.log("I am done being initted.");
        },
        activate: function() {
            this.versionWarning();
        },
        deactivate: function() {
            
        },
        isInRaspiCheckMode: false,
        raspiCapture: "",
        isRaspberryPi: false,
        checkIfRaspberryPi: function() {
            this.isInRaspiCheckMode = true;
            // we potentially have a raspi candidate. send actual cmd line and parse that
            this.send("cat /etc/os-release");
            this.send('echo "done-with-cat-etc-release"');
            

        },
        checkIfRaspberryPiCallback: function(payload) {
            // analyze what's coming back
            if (payload.Output.match(/done-with-cat-etc-release/)) {
                // we are done capturing
                this.isInRaspiCheckMode = false;
                console.log("done capturing");
                //this.appendLog('We captured\n<span style="color:red">' + this.raspiCapture + '</span>');
                
                if (this.raspiCapture.match(/raspbian/i)) {
                    // looks like we're on a raspi
                    this.appendLog("You are running SPJS on a Raspberry Pi.\n");
                    this.showAsRaspi();
                } else {
                    // It's not raspi
                    this.resetAsRaspi();
                }
                
                this.raspiCapture = "";
            } else {
                this.raspiCapture += payload.Output;
                
            }
        },
        showAsRaspi: function() {
            $('#' + this.id + ' .img-raspi').removeClass("hidden");
            this.isRaspberryPi = true;
        },
        resetAsRaspi: function() {
            $('#' + this.id + ' .img-raspi').addClass("hidden");
            this.isRaspberryPi = false;
        },
        execruntime: null,
        onExecRuntimeStatus: function(json) {
            console.log("got onExecRuntimeStatus. json:", json);
            this.appendLog(JSON.stringify(json) + "\n");
            
            if (json.OS.match(/linux/i) && json.Arch.match(/arm/i)) {
                this.execruntime = json;
                this.checkIfRaspberryPi();
                setTimeout(this.askForPwd.bind(this), 1000);
            }
        },
        sendExecRuntime: function() {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "execruntime");  
        },
        send: function(cmd) {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "exec " + cmd);  
        },
        askForPwd: function() {
            this.send("pwd");
            //this.send("echo $USER@$HOSTNAME $PWD");
        },
        consoleSubscribeToLowLevelSerial: function() {
            // subscribe to websocket events
            chilipeppr.subscribe("/com-chilipeppr-widget-serialport/ws/recv", this, this.onWsRecv);
        },
        onWsRecv: function(msg) {
            if (msg.match(/^\{/)) {
                // it's json
                var data = $.parseJSON(msg);
                console.log("got json for onWsRecv. data:", data);
                
                if ('ExecStatus' in data) {
                    this.appendLog(data.Output + "\n");      
                    if (this.isInRaspiCheckMode) {
                        this.checkIfRaspberryPiCallback(data);
                    }
                } else if ('ExecRuntimeStatus' in data) {
                    this.onExecRuntimeStatus(data);
                }
            }
        },
        setupClearBtn: function() {
            $('#' + this.id + ' .btn-clear').click(this.onClear.bind(this));
            //this.appendLog("asdfasdf");
        },
        onClear: function(evt) {
            console.log("onClear. evt:", evt);
            var log = this.logEls.log;
            log.html("");
        },
        onRecvLine: function(data) {
            if (data.dataline) {
                this.appendLog(data.dataline);
            }
        },
        onEchoOfSend: function(data) {
            this.appendLogEchoCmd(data);
        },
        
        appendLogEchoCmd: function(msg) {
            //console.log("appendLogEchoCmd. msg:", msg);
            var msg2 = $("<div class=\"out\"/>").text("" + msg);
            //console.log(msg2);
            this.appendLog(msg2);
        },
        logSetup: function() {
            if (this.logEls.log == null) {
                console.log("lazy loading logEls. logEls:", this.logEls);
                this.logEls.log = $('#' + this.id + ' .console-log pre');
                this.logEls.logOuter = $('#' + this.id + ' .console-log');
            }
        },
        logEls: {
            log: null,
            logOuter: null,
        },
        appendLog: function (msg) {
            //console.log("appendLog. msg:", msg);
            
            if (this.isFilterActive) {
                // see if log matches filter and ignore
                if ( !(msg.appendTo) && msg.match(this.filterRegExp)) {
                    return;
                }
            }
            
            
            //console.log("logEls:", this.logEls);
            //console.log(this.logEls.logOuter);
            var d = this.logEls.logOuter[0];
            var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
            var log = this.logEls.log;
            if (log.html().length > 25000) {
                // truncating log
                console.log("Truncating log.");
                /*
                var logHtml = log.html().split(/\n/);
                var sliceStart = logHtml.length - 200;
                if (sliceStart < 0) sliceStart = 0;
                log.html(logHtml.slice(sliceStart).join("\n"));
                */
                var loghtml = log.html();
                log.html("--truncated--" + loghtml.substring(loghtml.length - 2500));
            }
            if (msg.appendTo)
                msg.appendTo(log);
            else
                log.html(log.html() + msg );
            
            //if (doScroll) {
                d.scrollTop = d.scrollHeight - d.clientHeight;
            //}
        },
        
        history: [], // store history of commands so user can iterate back
        historyLastShownIndex: null,    // store last shown index so iterate from call to call
        pushOntoHistory: function(cmd) {
            this.history.push(cmd);
            
            // push onto dropup menu
            var el = $('<li><a href="javascript:">' + cmd + '</a></li>');
            $('#' + this.id + ' .console-form .dropdown-menu').append(el);
            el.click(cmd, this.onHistoryMenuClick.bind(this));
        },
        onHistoryMenuClick: function(evt) {
            console.log("got onHistoryMenuClick. data:", evt.data);
            $("#" + this.id + " .console-form input").val(evt.data);
            //return true;
        },
        consoleSetup: function () {
            var that = this;
            
            that.consoleSubscribeToLowLevelSerial();

            $("#" + this.id + " .console-form").submit(function (evt) {
                //console.log("got submit on form");
                console.group("submit on form in serial port console");
                evt.preventDefault();
                
                var msg = $('#' + that.id + ' .console-form input');
                console.log("msg:", msg.val());
                //if (!msg.val()) {
                //    return false;
                //}
                
                // push onto history stack
                if (msg.val().length > 0) {
                    //console.log("pushing msg to history. msg:", msg.val());
                    that.pushOntoHistory(msg.val());
                    
                }
                that.appendLogEchoCmd(msg.val());
                
                //var newline = "\n";
                
                // publish the cmd to the serial port json server
                var cmd = "exec " + msg.val(); // + newline;
                console.log("Sending cmd: ", cmd);
                chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", cmd);
                
                
                // reset input box to empty
                msg.val("");
                // reset history on submit
                that.historyLastShownIndex = null;
                console.groupEnd();
                return false;
            });
            
            // show history by letting user do up/down arrows
            $("#" + this.id + " .console-form").keydown(function(evt) {
                //console.log("got keydown. evt.which:", evt.which, "evt:", evt);
                if (evt.which == 38) {
                    // up arrow
                    if (that.historyLastShownIndex == null)
                        that.historyLastShownIndex = that.history.length;
                    that.historyLastShownIndex--;
                    if (that.historyLastShownIndex < 0) {
                        console.log("out of history to show. up arrow.");
                        that.historyLastShownIndex = 0;
                        return;
                    }
                    $("#" + that.id + " .console-form input").val(that.history[that.historyLastShownIndex]);
                } else if (evt.which == 40) {
                    if (that.historyLastShownIndex == null)
                        return;
                        //that.historyLastShownIndex = -1;
                    that.historyLastShownIndex++;
                    if (that.historyLastShownIndex >= that.history.length) {
                        console.log("out of history to show. down arrow.");
                        that.historyLastShownIndex = that.history.length;
                        $("#" + that.id + " .console-form input").val("");
                        return;
                    }
                    $("#" + that.id + " .console-form input").val(that.history[that.historyLastShownIndex]);
                }
            });

        },
        setupResizeable: function() {
            
            this.loadJqueryUi();
            var that = this;
            
            //$( "#com-chilipeppr-widget-gcode-body" ).resizable({
            $( "#" + this.id ).resizable({
                //alsoResize: "#com-chilipeppr-widget-gcode-body-2col > td:first"
                alsoResize: "#" + this.id + " .console-log",
                //ndex:1
                //handles: "s",
                
                //maxHeight:1000,
                resize: function(evt) {
                    console.log("resize resize", evt);
                    //$( ".com-chilipeppr-widget-spconsole" ).removeAttr("style");
                    $( "#" + that.id ).css('height', 'initial');
                    $( "#" + that.id + " .console-log" ).css('width', 'initial');
                },
                start: function(evt) {
                    console.log("resize start", evt);
                },
                stop: function(evt) {
                    console.log("resize stop", evt);
                    //$( ".com-chilipeppr-widget-spconsole" ).removeAttr("style");
                    $( "#" + that.id ).css('height', 'initial');
                    $( "#" + that.id + " .console-log" ).css('width', 'initial');
                }
            });
        },
        loadJqueryUi: function() {
            // load jquery-ui css, but make sure nobody else loaded it
            if (!$("link[href='//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css']").length)
            $('<link>')
            .appendTo('head')
            .attr({type : 'text/css', rel : 'stylesheet'})
            .attr('href', '//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css');  
        },
        resize: function() {
            // add the top of the widget + height of widget
            // to get sizing. then subtract that from height of window to figure out what height to add (subtract) from log
            var wdgt = $('#' + this.id);
            var wht = wdgt.offset().top + wdgt.height();
            var delta = $( window ).height() - wht;
            //console.log("delta:", delta, "wht:", wht);
            var loght = $('#' + this.id + ' .console-log').height();
            $('#' + this.id + ' .console-log').height(loght + delta - 13);
        },
        resizerSetup: function() {
            // due to the layout complexity here of being
            // nested very deep, doing absolute positioning
            // for pure CSS resize is not working, so use
            // jquery resize
            var that = this;
            $( window ).resize(function() {
                //console.log("New height of window after resize: ", $( window ).height() );
                //console.log("New pos of .com-chilipeppr-widget-spconsole:", $('.com-chilipeppr-widget-spconsole').offset(), "height:",  $('.com-chilipeppr-widget-spconsole').height());
                //console.log("New height of .com-chilipeppr-widget-spconsole-console-log:", $('.com-chilipeppr-widget-spconsole-console-log').height() );
                that.resize();
            });
        },
        isVersionWarningInitted: false,
        ptrTimeout: null, // holds the pointer to the setTimeout fallback
        versionWarning: function() {
            // if we were specifically given a version, just treat that
            // like normal and don't trigger a callback
            
            var options = this.options;
            
            // see if we should hide the version warning
            if (options && 'spjsVersion' in options) {
                
                // we were statically given a version warning, so use that
                console.log("spjsVersion. we were statically given version so will not trigger callback technique. spjsVersion:", options.spjsVersion);
                
                if (options.spjsVersion >= 1.83) {
                    $('#com-chilipeppr-widget-terminal .panel-body .alert-danger').addClass("hidden");
                    this.resize();
                } else {
                    $('#com-chilipeppr-widget-terminal .panel-body .alert-danger').removeClass("hidden");
                    this.resize();
                }
                
            } else {
                
                console.log("spjsVersion. we were not given a spjsVersion so we are asking the serial port widget to tell us");
                
                // we need to ask spjs to get a version back
                if (this.isVersionWarningInitted == false) {
                    chilipeppr.subscribe("/com-chilipeppr-widget-serialport/recvVersion", this, this.onVersionWarningCallback);
                }
                
                // wait about 2 seconds just to wait a bit for connecting
                setTimeout(function() {
                    chilipeppr.publish("/com-chilipeppr-widget-serialport/requestVersion");
                }, 3000);
                
                // now do a callback in 5 seconds if we get nothing back from /requestVersion because
                // that means we're not connected to any server
                //setTimeout(this.onTimeoutFromVersionRequest.bind(this), 5000);
                
            }
                    

        },
        onVersionWarningCallback: function(spjsVersion) {
            console.log("spjsVersion. got versionWarningCallback. spjsVersion:", spjsVersion);
            
            // immediately cancel the fallback timeout
            //if (this.ptrTimeout) clearTimeout(this.ptrTimeout);
            
            
            // we were staitically given a version warning, so use that
            if (spjsVersion == 0) {
                // we got bunk data back, this likely means its not connected yet
                console.log("got (spjsVersion == 0. bunk");
                // do nothing
            } else if (spjsVersion >= 1.87) {
                console.log("spjsVersion was >= 1.87. cool");
                $('#com-chilipeppr-widget-terminal .panel-body .alert-badversion').addClass("hidden");
                this.resize();

            } else {
                console.log("spjsVersion was NOT >= 1.87. cool");
                $('#com-chilipeppr-widget-terminal .panel-body .alert-badversion').removeClass("hidden");
                $('#com-chilipeppr-widget-terminal .yourspjsversion').text(spjsVersion);
                this.resize();

            }
        },
        onTimeoutFromVersionRequest: function() {
            console.log("got fallback timeout, which means the spjs is not connected");
            $('#com-chilipeppr-widget-terminal .panel-body .alert-notconnected').removeClass("hidden");
        },
        isSpjsStatusWarningInitted: false,
        requestSpjsStatus: function() {
            // we need to ask spjs to get a version back
            if (this.isSpjsStatusWarningInitted == false) {
                chilipeppr.subscribe("/com-chilipeppr-widget-serialport/recvStatus", this, this.onRequestSpjsStatusCallback);
            }
            
            // wait about 2 seconds just to wait a bit for connecting
            setTimeout(function() {
                chilipeppr.publish("/com-chilipeppr-widget-serialport/requestStatus");
            }, 2000);
            
            //this.appendLog("Checking SPJS status...\n");
        },
        onRequestSpjsStatusCallback: function(payload) {
            if (payload.connected) {
                $('#com-chilipeppr-widget-terminal .panel-body .alert-notconnected').addClass("hidden");
                this.resize();

                this.appendLog("Connected.\n");
                
                // now ask for our execRuntime
                this.sendExecRuntime();
            } else {
                $('#com-chilipeppr-widget-terminal .panel-body .alert-notconnected').removeClass("hidden");
                this.resize();

                this.appendLog("Not connected.\n");
                this.resetAsRaspi();
            }
        },

        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            this.setupClearBtn();
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});