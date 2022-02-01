
$('#building-type').change(displayBuildingTypeSection);

function displayBuildingTypeSection() {
    
    let buildingType = $('#building-type').val();

    
    $('.inputField').hide();
    $('.product-line').hide();

    
    if (buildingType != "") {
        
        $('.inputField.' + buildingType).show();
        $('.product-line').show();
    }
}


$('input[type="number"]').change(calculateBulding);
$('input[type="radio"]').change(calculateBulding);

function calculateBulding() {
    
    let buldingType     = $('#building-type').val();
    let productLine     = $('input[name="product-line"]:checked').val();
    let apartments      = parseInt($('input[name="number-of-apartments"]').val());
    let floors          = parseInt($('input[name="number-of-floors"]').val());
    let basements       = parseInt($('input[name="number-of-basements"]').val());
    let companies       = parseInt($('input[name="number-of-companies"]').val());
    let parkingSpots    = parseInt($('input[name="number-of-parking-spots"]').val());
    let elevators       = parseInt($('input[name="number-of-elevators"]').val());
    let corporations    = parseInt($('input[name="number-of-corporations"]').val());
    let occupancy       = parseInt($('input[name="maximum-of-occupancy"]').val());
    let businessHours   = parseInt($('input[nape="business-hours"]').val());

    
    switch(buldingType) {
        case "residential":
            calculateResidential(apartments, floors, basements, productLine);
            break;
        case "commercial":
            calculateCommercial(floors, basements, companies, parkingSpots, elevators, productLine);
            break;

        case "corporate":
            calculateCorporate(floors, basements, parkingSpots, corporations, occupancy, productLine);
            break;

        case "hybrid":
            calculateHybrid(floors, basements, companies, parkingSpots, occupancy, businessHours,  productLine);
    }
}

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

function calculateResidential(apartments, floors, basements, productLine) {
    let results = {
        elevatorAmount: 0,
        elevatorUnitPrice: 0,
        elevatorTotalPrice: 0,
        installationFees: 0, 
        finalPrice: 0
    };
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);
    

    if (!isNaN(apartments) && !isNaN(floors) && !isNaN(basements) && !isNaN(productLinePrice)) {
        let averageApartments = Math.ceil(apartments / (floors - basements));
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

function calculateCommercial(floors, basements, companies, parkingSpots, elevators, productLine) {
    let results = {
        elevatorAmount: 0,
        elevatorUnitPrice: 0,
        elevatorTotalPrice: 0,
        installationFees: 0, 
        finalPrice: 0
    };
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);

    if (!isNaN(elevators) && !isNaN(productLinePrice)) {
        results.elevatorAmount      = elevators;
        results.elevatorUnitPrice   = productLinePrice;
        results.elevatorTotalPrice  = results.elevatorAmount*productLinePrice;
        results.installationFees    = results.elevatorTotalPrice*productLineFees;
        results.finalPrice          = results.elevatorTotalPrice+results.installationFees;
    }

    displayResults(results); 
    
    
}

function calculateCorporate(floors, basements, parkingSpots, corporations, occupancy, productLine) {
    let results = {
        elevatorAmount: 0,
        elevatorUnitPrice: 0,
        elevatorTotalPrice: 0,
        installationFees: 0, 
        finalPrice: 0
    };
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);

    // if (!isNaN(elevators) && !isNaN(productLinePrice)) {
    //     results.elevatorAmount      = occuoancy * floors
    //     results.elevatorUnitPrice   = productLinePrice
    //     results.elevatorTotalPrice  = results.elevatorAmount*productLinePrice;
    //     results.installationFees    = results.elevatorTotalPrice*productLineFees;
    //     results.finalPrice          = results.elevatorTotalPrice+results.installationFees;
    // }

    displayResults(results); 
    
    
}

function calculateHybrid(floors, basements, companies, parkingSpots, occupancy, businessHours,  productLine) {
    let results = {
        elevatorAmount: 0,
        elevatorUnitPrice: 0,
        elevatorTotalPrice: 0,
        installationFees: 0, 
        finalPrice: 0
    };
    let productLinePrice = getProductLinePrice(productLine);
    let productLineFees = getInstallationFees(productLine);

    // if (!isNaN(elevators) && !isNaN(productLinePrice)) {
    //     results.elevatorAmount      = 
    //     results.elevatorUnitPrice   = 
    //     results.elevatorTotalPrice  = 
    //     results.installationFees    = results.elevatorTotalPrice*productLineFees;
    //     results.finalPrice          = results.elevatorTotalPrice+results.installationFees;
    // }

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