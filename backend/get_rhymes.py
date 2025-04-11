'''
BahčaBojá secret sauce
'''
import re

VOWELS = "aáeiouyö"
INVALID_RHYME = "rušpi"

def extract_vowel_sequence(word):
    """
    Extracts all sequences of one or more consecutive vowels from the 
    input word, preserving their order.

    Returns:
        List[str]: A list of vowel group strings found in the word.
    """
    return re.findall(f'[{VOWELS}]+', word, re.IGNORECASE)

def handle_double_vowels(vowel_groups):
    """
    Splits vowel groups that start with repeated vowels (e.g., "aa") into
    smaller segments to increase rhyme flexibility. Special handling is
    applied for "ii".

    Returns:
        List[str]: A list of processed vowel groups.
    """
    processed = []
    for group in vowel_groups:
        if len(group) > 1 and group[0] == group[1]: 
            if group == "ii":
                processed.append("i")
                continue
            processed.extend([group[0], group[1:]])
        else:
            processed.append(group)
    return processed

def get_vowels_reversed(word):
    """
    Extracts vowel sequences from a word, splits double vowels, and reverses
    the order.

    Returns:
        List[str]: A reversed list of processed vowel groups.
    """    
    vowel_groups = handle_double_vowels(extract_vowel_sequence(word))
    return vowel_groups[::-1]

def matches_rhyme_rule(input_word, input_vowels, candidate):
    """
    Evaluates whether the candidate word matches the rhyme pattern of the input word,
    based on vowel sequence alignment.

    Returns:
        int: A category identifier for rhyme quality, or INVALID_RHYME if not a match.
    """
    candidate_vowels = get_vowels_reversed(candidate.lower())

    input_index = 0
    vowels_matching = 0
    for cand_vowel in candidate_vowels:
        if input_index == len(input_vowels) or cand_vowel != input_vowels[input_index]:
            break
        
        if cand_vowel == input_vowels[input_index]:
            vowels_matching += len(cand_vowel)
            input_index += 1
            continue
        
        # Extra consecutive vowels where the input doesn't have them
        return INVALID_RHYME
        
    # calculates the total number of characters in the last two elements
    min_vowels_to_match = len("".join(input_vowels[-2:])) 
    
    if vowels_matching < min_vowels_to_match:
        return INVALID_RHYME
    
    extra_vowels = candidate_vowels[input_index:] # list
    extra_vowels_count = len(extra_vowels)
    
    if (input_vowels == candidate_vowels):
            
        input_word_pattern = get_word_pattern(input_word)
        candidate_pattern = get_word_pattern(candidate)
        
        if (input_word_pattern == candidate_pattern):
            return 0
        
        if len(input_word) == len(candidate):
            return 1
        return 1
    
    for group in candidate_vowels:
        # fix syllable count of words with "eoai"    
        if len(group) == 4:
            extra_vowels_count += 1
    return extra_vowels_count + 2

def get_word_pattern(word):
    """
    Converts a word into a pattern of 'C' for consonants and 'V' for vowels.

    Returns:
        str: A string representing the consonant-vowel structure of the word.
    """
    word_pattern = ""
    for letter in word:
        if letter in VOWELS:
            word_pattern += "V"
            continue
        word_pattern += "C"
    return word_pattern

def get_consonant_pattern(word: str) -> str:
    """
    Converts a word into a pattern string where vowels are replaced with 'V'
    and consonants remain unchanged.

    Returns:
        str: A consonant pattern string of the word.
    """
    pattern = []
    for ch in word.lower():
        if ch in VOWELS:
            pattern.append("V")
        else:
            pattern.append(ch) # Keep consonants
    return "".join(pattern)

def find_consonance_rhymes(word, word_list):
    """
    Identifies words from word_list that have the same consonant-vowel
    pattern as the given word.

    Returns:
        List[str]: Words that match the consonant pattern of the input word.
    """
    word = word.lower()
    rhymes = []
    word_pattern = get_consonant_pattern(word)
    for w in word_list:
        
        if get_consonant_pattern(w) == word_pattern and word != w:
            rhymes.append(w)
    if not rhymes:
        return {}
    return {0: rhymes}

def find_vowel_rhymes(word, word_list):
    """
    Finds and categorizes words from the word_list that rhyme with the given
    word based on vowel pattern matching and structure.

    Returns:
        Dict[int, List[str]]: A dictionary mapping rhyme categories to lists
        of rhyming words.
    """
    
    word = word.lower()
    rhymes_categorized = {}
    word_vowels = get_vowels_reversed(word.lower()) # list
    
    for w in word_list:
        category = INVALID_RHYME
        category = matches_rhyme_rule(word, word_vowels, w)
        
        if category != INVALID_RHYME:
            rhymes_categorized.setdefault(category, []).append(w)
    
    rhymes_categorized = {key: rhymes_categorized[key] for key in sorted(rhymes_categorized)}
    
    # a word is not its own rhyme
    if 0 in rhymes_categorized and word in rhymes_categorized[0]:
        rhymes_categorized[0].remove(word)
        if len(rhymes_categorized[0]) == 0:
            del rhymes_categorized[0]
    
    # update syllable count
    if len(word_vowels) == 1:
        rhymes_categorized = {
            (k - 1 if k > 2 else k): v
            for k, v in rhymes_categorized.items()
        }      
    return rhymes_categorized