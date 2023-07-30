window.oview = window.oview || {};

(function(){

    var dynaId = 1;

    function MakeUi(params){
        this.init(params);
    }

    var p = MakeUi.prototype;

    p.init = function(params){
        this._main = params.main;


		var elem = params.elem;
        if(typeof elem == "string"){
            elem = document.getElementById(elem);
        }

        this.root = elem;
        this.root.innerHTML = html;
        
        var list = this.root.querySelectorAll("[data-oview-id]");
	
        this.list = {};
		for(var i=0; i<list.length; i++){
            var item = list[i]
			var id = item.getAttribute("data-oview-id");
			this.list[id] = item;
		}

        // apply "for attribute" dynamically ("for attribute" only works on ID's)
        var list = this.root.querySelectorAll("[data-oview-for]");
	
		for(var i=0; i<list.length; i++){

            var did = "ovieDynaId" + (dynaId++);

            var item = list[i]
			var id = item.getAttribute("data-oview-for");
            var input = document.querySelector("[data-oview-id=" + id + "]");
            input.id = did;
            item.setAttribute("for", did);
		}

        

    };

    window.oview.MakeUi = MakeUi;

    var html = `<div data-oview-id="clickMask" style="display:none"></div>
	<div data-oview-id="main">
		<div data-oview-id="filterHistoryWrapper">
			<div data-oview-id="filterHistory" style="display:none"></div>
		</div>
		<div data-oview-id="tools">
			<div data-oview-id="toggleMin" title="open/close all" class="oview-toolbar-icon"><i class="oview-toggleMin"></i></div>
			<div data-oview-id="clear" title="clear output" class="oview-toolbar-icon"><i class="oview-clear"></i></div>
			<div data-oview-id="reverse" title="new items appear at top/bottom" class="oview-toolbar-icon"><i class="oview-down"></i></div>

			<div data-oview-id="filterWrapper">
				<input data-oview-id="filter" type="search" name="q" title="filter" placeholder="filter" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
			</div>
			<div data-oview-id="regxWrapper" title="regular expression&#013;&#013;- don't use slashes, just the stuff you would normally put between /and/ &#013;&#013;- we also automatically set the 'i' flag for case insensitivity">
				<span class="oview-t-icon" data-oview-id="regx">RE&nbsp;</span>
			</div>
			<div data-oview-id="searchMask" title="show/hide/invert matches&#013;This is a 3 state switch&#013;1. shows everything&#013;2. Hides lines that DON'T match.&#013;3. Hides lines that DO match." class="oview-toolbar-icon"><i class="oview-eye"></i></div>
			
			<div data-oview-id="save" title="save output as JSON, CVS, HTML or TEXT" class="oview-toolbar-icon"><i class="oview-save"></i></div>

		</div>

		<div data-oview-id="saveDialog" style="display:none">
			<p><strong>Export Data As</strong></p>
			<div class="oview-genericButton" data-oview-id="saveJson">JSON</div>
			<div class="oview-genericButton" data-oview-id="saveHtml">HTML</div>
			<div class="oview-genericButton" data-oview-id="saveText">TEXT</div>
			<div class="oview-genericButton" data-oview-id="saveCsv">CSV</div>
            <label data-oview-for="rotateCVS" class="oview-small-text oview-align-right">Rotate CSV 90&deg; <input data-oview-id="rotateCVS" style="width:unset" type="checkbox"></label>
		</div>

		<div data-oview-id="output">

		</div>
	</div>`
})();