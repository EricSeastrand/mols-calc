function loadPeriodicTable(){
	var table = window._periodicTable.table;
	var select = $('select.periodic-table');

	for(var column in table) {
		var period = table[column].elements;
		for(var row in period) {
			var element = period[row];
			_renderElementDOM(element);
			select.append(element.DOM);
		}
	}
}

function _renderElementDOM(element) {
	element.DOM = $('<option>')
		.text(element.small+'['+element.name+']')
		.attr('title', element.molar+'g/Mol')
		.data('element', element);

	element.grams2mols = grams2mols;
	element.mols2grams = mols2grams;
}


function grams2mols(numGrams) {
	return numGrams / this.molar;
}
function mols2grams(numMols) {
	return numMols * this.molar;
}

function initMolsCalculator(){
	var selectedElement = false;

	var select = $('select.periodic-table');

	select.on('change', function(){
		selectedElement = $(this).find(':selected').data('element');

		try{ select.lastUsed(); } catch(e){}
	});

	var mols = $('input.mols');
	mols.on('change', toMass);


	var mass = $('input.mass');
	mass.on('change', toMols);

	// Update [input]mols to reflect the value of [input]mass 
	function toMols(){
		var numGrams = mass.val();
		var numMols = selectedElement.grams2mols( numGrams );

		mols.val( numMols );

		select.lastUsed = toMols;
	}

	// Update [input]mass to reflect the value of [input]mols
	function toMass(){
		var numMols = mols.val();
		var numGrams = selectedElement.mols2grams( numMols );

		mass.val( numGrams );

		select.lastUsed = toMass;
	}

	function debug(content){
		$('.mols-calculator-debug').empty().append(content);
	}


	select.prop('selectedIndex', 0);
	select.trigger('change');
	toMass();

}
$(loadPeriodicTable);
$(initMolsCalculator);