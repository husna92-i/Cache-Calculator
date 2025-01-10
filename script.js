function convertToBytes(value, unit) {
    const conversions = {
        'bytes': value * Math.pow(2, 3),
        'KB': value * Math.pow(2, 10),
        'MB': value * Math.pow(2, 20),
        'GB': value * Math.pow(2, 30),
        'TB': value * Math.pow(2, 40)
    };
    return conversions[unit] || value;
}

function log2(number) {
    return Math.log(number) / Math.log(2);
}

function validateInputs(memorySize, cacheSize, wordSize) {
    if (isNaN(memorySize) || isNaN(cacheSize) || isNaN(wordSize)) {
        return "Please enter valid numbers for all fields.";
    }
    if (memorySize <= 0 || cacheSize <= 0 || wordSize <= 0) {
        return "All sizes must be greater than 0.";
    }
    if (cacheSize > memorySize) {
        return "Cache size cannot be larger than memory size.";
    }
    if (wordSize > cacheSize) {
        return "Word size cannot be larger than cache size.";
    }
    return null;
}

function calculateCache() {
    // Get input values
    const memorySize = convertToBytes(
        parseFloat(document.getElementById('memorySize').value),
        document.getElementById('memorySizeUnit').value
    );
    const cacheSize = convertToBytes(
        parseFloat(document.getElementById('cacheSize').value),
        document.getElementById('cacheSizeUnit').value
    );
    const wordSize = convertToBytes(
        parseFloat(document.getElementById('wordSize').value),
        document.getElementById('wordSizeUnit').value
    );
    const mappingType = document.getElementById('mappingType').value;

    // Validate inputs
    const validationError = validateInputs(memorySize, cacheSize, wordSize);
    if (validationError) {
        document.getElementById('result').innerText = validationError;
        return;
    }

    // Calculate base values
    const totalAddressBits = Math.ceil(log2(memorySize));
    const cacheSizeBits = Math.ceil(log2(cacheSize));
    const wordBits = Math.ceil(log2(wordSize));
    let explanation = '';

    try {
        switch(mappingType) {
            case 'direct':
                // Direct Mapping Calculation
                const numberOfLines = Math.floor(cacheSize / wordSize);
                const lineBits = Math.ceil(log2(numberOfLines));
                const tagBitsDirect = totalAddressBits - lineBits - wordBits;

                explanation = `Direct Mapping Analysis:\n` +
                    `Memory Address Size: ${totalAddressBits} bits\n` +
                    `Cache Memory Size: ${cacheSizeBits} bits\n` +
                    `Number of Cache Lines: ${numberOfLines}\n` +
                    `Address Breakdown:\n` +
                    `• Tag: ${tagBitsDirect} bits\n` +
                    `• Line: ${lineBits} bits\n` +
                    `• Word: ${wordBits} bits\n` +
                    `Total: ${tagBitsDirect + lineBits + wordBits} bits`;
                break;

            case 'fully':
                // Fully Associative Mapping
                const tagBitsFully = totalAddressBits - wordBits;

                explanation = `Fully Associative Mapping Analysis:\n` +
                    `Memory Address Size: ${totalAddressBits} bits\n` +
                    `Cache Memory Size: ${cacheSizeBits} bits\n` +
                    `Address Breakdown:\n` +
                    `• Tag: ${tagBitsFully} bits\n` +
                    `• Word: ${wordBits} bits\n` +
                    `Total: ${tagBitsFully + wordBits} bits`;
                break;

            case 'set':
                // Set Associative Mapping
                const k = parseInt(document.getElementById('associativity').value);
                const numberOfSets = Math.floor(cacheSize / (k * wordSize));
                const setBits = Math.ceil(log2(numberOfSets));
                const tagBitsSet = totalAddressBits - setBits - wordBits;

                explanation = `${k}-Way Set Associative Mapping Analysis:\n` +
                    `Memory Address Size: ${totalAddressBits} bits\n` +
                    `Cache Memory Size: ${setBits + wordBits} bits\n` +
                    `Number of Sets: ${numberOfSets}\n` +
                    `Address Breakdown:\n` +
                    `• Tag: ${tagBitsSet} bits\n` +
                    `• Set: ${setBits} bits\n` +
                    `• Word: ${wordBits} bits\n` +
                    `Total: ${tagBitsSet + setBits + wordBits} bits`;
                break;
        }

        document.getElementById('result').innerText = explanation;
    } catch (error) {
        document.getElementById('result').innerText = 
            "Error in calculation. Please check your input values.";
    }
}
