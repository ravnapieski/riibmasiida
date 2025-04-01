'''
BahčaBojá secret sauce
'''
import re

VOWELS = "aáeiouyö"
INVALID_RHYME = "rušpi"

def extract_vowel_sequence(word):
    """Extracts the sequence of vowels from a word while preserving consecutive vowels as groups."""
    
    return re.findall(f'[{VOWELS}]+', word, re.IGNORECASE)

def remove_double_i(vowel_groups):
    """Modifies any 'ii' group into 'i' while keeping other groups intact."""
    processed = []
    for group in vowel_groups:
        if group.lower() == "ii":
            processed.extend(["i"])
        else:
            processed.append(group)
    return processed

def matches_rhyme_rule(input_word, candidate):
    """Checks if the candidate word follows the required rhyme pattern based on the input word."""
    input_vowels = remove_double_i(extract_vowel_sequence(input_word))
    input_vowels.reverse()
    candidate_vowels = remove_double_i(extract_vowel_sequence(candidate))
    candidate_vowels.reverse()
    
    #if len(candidate_vowels) > len(input_vowels):
        #return False  # Not enough vowels to match
    
    #if len(candidate_vowels) != len(input_vowels):
        #return False
    
    input_index = 0
    vowels_matching = 0
    extra_vowels = 0
    for cand_vowel in candidate_vowels:
        if input_index == len(input_vowels):
            cand_extra_vowels = candidate_vowels[input_index:]
            extra_vowels += len(cand_extra_vowels)
            break
        
        if cand_vowel == input_vowels[input_index]:
            input_index += 1
            vowels_matching += len(cand_vowel)
            continue
        
        elif len(cand_vowel) > 1:  # Extra consecutive vowels where the input doesn't have them
            return INVALID_RHYME
        
        elif cand_vowel != input_vowels[input_index]:
            # vowels dont match
            cand_extra_vowels = candidate_vowels[input_index:]
            extra_vowels += len(cand_extra_vowels)
            break
    #return input_index == len(input_vowels)  # Must match all vowel sequences
    
    # calculates the total number of characters in the last two elements
    min_vowels_to_match = len("".join(input_vowels[-2:])) 
    
    if vowels_matching < min_vowels_to_match:
        return INVALID_RHYME

    
    if (input_vowels == candidate_vowels):
            
        input_word_pattern = get_word_pattern(input_word)
        candidate_pattern = get_word_pattern(candidate)
        
        if (input_word_pattern == candidate_pattern):
            return 0
        
        if len(input_word) == len(candidate):
            return 1
        return 1
    #vowel_difference = len(candidate_vowels) - len(input_vowels)
    #return vowel_difference
    
    # a word with "eoai" will always be one syllable longer
    for group in candidate_vowels:
        if len(group) == 4:
            extra_vowels += 1
    return extra_vowels + 2

def find_rhymesss(word, word_list):
    """Finds words that rhyme with the given word based on the new rhyme rule."""
    
    #rhymes = [w for w in word_list if matches_rhyme_rule(word, w)]

    rhymes_categorized = {}
    
    for w in word_list:
        
        category = INVALID_RHYME
        category = matches_rhyme_rule(word, w)
        
        if category != INVALID_RHYME:
            rhymes_categorized.setdefault(category, []).append(w)
    
    rhymes_categorized = {key: rhymes_categorized[key] for key in sorted(rhymes_categorized)}
    
    # a word is not its own rhyme
    if 0 in rhymes_categorized and word in rhymes_categorized[0]:
        rhymes_categorized[0].remove(word)
        if len(rhymes_categorized[0]) == 0:
            del rhymes_categorized[0]
            
    return rhymes_categorized

def get_word_pattern(word):
    word_pattern = ""
    for letter in word:
        if letter in VOWELS:
            word_pattern += "V"
            continue
        word_pattern += "C"
    return word_pattern