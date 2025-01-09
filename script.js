// Convert size to bytes
function convertToBytes(value, unit) {
    const units = {
        'KB': 10,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024
    };
    return value * units[unit];
}

// Calculate number of bits needed to represent a number
function bitsNeeded(number) {
    return Math.ceil(Math.log2(number));
}

function calculateCache() {
    // Get input values
    const cacheSize = convertToBytes(
        parseFloat(document.getElementById('cacheSize').value),
        document.getElementById('cacheSizeUnit').value
    );
    const blockSize = convertToBytes(
        parseFloat(document.getElementById('blockSize').value),
        document.getElementById('blockSizeUnit').value
    );
    const mappingType = document.getElementById('mappingType').value;
    
    // Basic validation
    if (!cacheSize || !blockSize) {
        document.getElementById('result').textContent = 'Please enter valid sizes';
        return;
    }

    // From PDF: Main memory address calculation
    const WORD_SIZE = 1; // 1 byte per word as per PDF
    const wordBits = bitsNeeded(WORD_SIZE); // Word field bits
    
    // Calculate total memory address bits (as shown in PDF examples)
    const totalAddressBits = 35; // Standard 32GB address space + 3 bits for byte addressing
    
    let result = '';
    
    switch (mappingType) {
        case 'direct':
            result = calculateDirectMapping(cacheSize, blockSize, wordBits, totalAddressBits);
            break;
            
        case 'fully':
            result = calculateFullyAssociative(cacheSize, blockSize, wordBits, totalAddressBits);
            break;
            
        case 'set':
            const associativity = parseInt(document.getElementById('associativity').value);
            result = calculateSetAssociative(cacheSize, blockSize, wordBits, totalAddressBits, associativity);
            break;
    }
    
    document.getElementById('result').textContent = result;
}

function calculateDirectMapping(cacheSize, blockSize, wordBits, totalAddressBits) {
    // Following PDF Direct Mapping structure:
    // Address = tag + line + word
    
    // Calculate number of cache lines
    const numberOfLines = Math.floor(cacheSize / blockSize);
    const lineBits = bitsNeeded(numberOfLines);
    
    // Tag bits = Total address bits - (line bits + word bits)
    const tagBits = totalAddressBits - lineBits - wordBits;
    
    return `Direct Mapping Analysis:
    Total Address Bits: ${totalAddressBits} bits
    Tag Field: ${tagBits} bits (used for comparison)
    Line Field: ${lineBits} bits (index into cache)
    Word Field: ${wordBits} bits (byte select within block)
    
    Cache Organization:
    Number of Cache Lines: ${numberOfLines}
    Block Size: ${blockSize} bytes
    Cache Size: ${cacheSize} bytes
    `;
}

function calculateFullyAssociative(cacheSize, blockSize, wordBits, totalAddressBits) {
    // Following PDF Fully Associative structure:
    // Address = tag + word
    
    // Calculate number of cache lines
    const numberOfLines = Math.floor(cacheSize / blockSize);
    
    // In fully associative, all bits except word bits are tag bits
    const tagBits = totalAddressBits - wordBits;
    
    return `Fully Associative Mapping Analysis:
    Total Address Bits: ${totalAddressBits} bits
    Tag Field: ${tagBits} bits (used for comparison with all lines)
    Word Field: ${wordBits} bits (byte select within block)
    
    Cache Organization:
    Number of Cache Lines: ${numberOfLines}
    Block Size: ${blockSize} bytes
    Cache Size: ${cacheSize} bytes
    `;
}

function calculateSetAssociative(cacheSize, blockSize, wordBits, totalAddressBits, associativity) {
    // Following PDF Set-Associative structure:
    // Address = tag + set + word
    
    // Calculate number of sets (total lines / associativity)
    const totalLines = Math.floor(cacheSize / blockSize);
    const numberOfSets = Math.floor(totalLines / associativity);
    const setBits = bitsNeeded(numberOfSets);
    
    // Tag bits = Total address bits - (set bits + word bits)
    const tagBits = totalAddressBits - setBits - wordBits;
    
    return `${associativity}-Way Set Associative Mapping Analysis:
    Total Address Bits: ${totalAddressBits} bits
    Tag Field: ${tagBits} bits (used for comparison within set)
    Set Field: ${setBits} bits (index into cache sets)
    Word Field: ${wordBits} bits (byte select within block)
    
    Cache Organization:
    Number of Sets: ${numberOfSets}
    Lines per Set: ${associativity}
    Total Cache Lines: ${numberOfSets * associativity}
    Block Size: ${blockSize} bytes
    Cache Size: ${cacheSize} bytes
    `;
}

// Show/hide associativity dropdown based on mapping type
document.getElementById('mappingType').addEventListener('change', function() {
    const associativityGroup = document.getElementById('associativityGroup');
    associativityGroup.style.display = this.value === 'set' ? 'block' : 'none';
});