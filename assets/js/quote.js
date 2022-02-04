//listening on the change of the building type
$('#building-type').change(displayBuildingTypeSection);

function displayBuildingTypeSection() {
    
    let buildingType = $('#building-type').val();

    $('.inputField').hide();
    $('.product-line').hide();

    if (buildingType != "") {
        
        $('.inputField.' + buildingType).show();
        $('.product-line').show();
        calculateBulding();
    } else {
        displayResults(getInitialResults());
    }
    
}

// listening on the change of the form
$('input[type="number"]').on('change', calculateBulding);
$('input[type="number"]').on('keyup', calculateBulding);
$('input[type="radio"]').change(calculateBulding);

/**
 * Get form data 
 */
function calculateBulding() {
    
    let buldingType     = $('#building-type').val();
    let productLine     = $('input[name="product-line"]:checked').val();
    let apartments      = parseInt($('input[name="number-of-apartments"]').val());
    let floors          = parseInt($('input[name="number-of-floors"]').val());
    let basements       = parseInt($('input[name="number-of-basements"]').val());
    let companies       = parseInt($('input[name="number-of-companies"]').val());
    let parkingSpots    = parseInt($('input[name="number-of-parking-spots"]').val());
    let elevators       = parseInt($('input[name="number-of-elevators"]').val());
    let occupancy       = parseInt($('input[name="maximum-of-occupancy"]').val());
    

    
    switch(buldingType) {
        case "residential":
            calculateResidential(apartments, floors, basements, productLine);
            break;

        case "commercial":
            calculateCommercial(elevators, productLine);
            break;

        case "corporate":
        case "hybrid":
            calculateCorporateHybrid(floors, basements, occupancy, productLine);
            break;
    }
}

/**
 * Get product line price
 * @param {string} productLine 
 * @returns {number} Product line price
 */
function getProductLinePrice(productLine) {
    switch(productLine) {
        case "standard":
            return 7565;
        case "premium":
            return 12345;
        case "excelium":
            return 15400;                
    }
}

function getInstallationFees(productLine) {
    switch(productLine) {
        case "standard":
            return 0.1;
        case "premium":
            return 0.13;
        case "excelium":
            return 0.16;                
    }
}
function getInitialResults() {
    return {
        elevatorAmount: 0,
        elevatorUnitPrice: 0,
        elevatorTotalPrice: 0,
        installationFees: 0, 
        finalPrice: 0
    };
}

function calculateResidential(apartments, floors, basements, productLine) 
{
    let results = getInitialResults();
    
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);
    

    if (!isNaN(apartments) && !isNaN(floors) && !isNaN(basements) && !isNaN(productLinePrice)) {
        let averageApartments = Math.ceil(apartments / floors);
        results.elevatorAmount = Math.ceil(averageApartments / 6);
        if (floors > 20) {
            let modifier = Math.ceil(floors / 20);
            results.elevatorAmount = results.elevatorAmount * modifier;
        }

        results.elevatorUnitPrice   = productLinePrice
        results.elevatorTotalPrice  = results.elevatorAmount*productLinePrice
        results.installationFees    = results.elevatorTotalPrice*productLineFees;
        results.finalPrice          = results.elevatorTotalPrice+results.installationFees;
    }

    displayResults(results); 
    
    
}

function calculateCommercial(elevators, productLine) 
{
    let results = getInitialResults();
   
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);

    if (!isNaN(elevators) && !isNaN(productLinePrice)) 
    {
        results.elevatorAmount      = elevators;
        results.elevatorUnitPrice   = productLinePrice;
        results.elevatorTotalPrice  = results.elevatorAmount*productLinePrice;
        results.installationFees    = results.elevatorTotalPrice*productLineFees;
        results.finalPrice          = results.elevatorTotalPrice+results.installationFees;
    }

    displayResults(results); 
    
    
}

function calculateCorporateHybrid(floors, basements, occupancy, productLine) 
{
    let results = getInitialResults();
    
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);

    if (!isNaN(floors) && !isNaN(basements) && !isNaN(occupancy) && !isNaN(productLinePrice)) 
    {
       
        let totalOccupancy = Math.ceil(occupancy * (floors+basements));
        results.elevatorAmount = Math.ceil(totalOccupancy / 1000);
        results.elevatorColumn = Math.ceil((floors+basements) / 20);
        results.elevatorAmount = Math.ceil(Math.ceil(results.elevatorAmount / results.elevatorColumn) * results.elevatorColumn);
        
        results.elevatorUnitPrice   = productLinePrice;
        results.elevatorTotalPrice  = results.elevatorAmount*productLinePrice;
        results.installationFees    = results.elevatorTotalPrice*productLineFees;
        results.finalPrice          = results.elevatorTotalPrice+results.installationFees;
    }

    displayResults(results); 
    
    
}


function displayResults(results) {
    $('input[name="elevator-amount"]').val(results.elevatorAmount);
    $('input[name="elevator-unit-price"]').val(formatPrice(results.elevatorUnitPrice));
    $('input[name="elevator-total-price"]').val(formatPrice(results.elevatorTotalPrice));
    $('input[name="installation-fees"]').val(formatPrice(results.installationFees));
    $('input[name="final-price"]').val(formatPrice(results.finalPrice));
}

function formatPrice(price) {
    return price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " $";
}