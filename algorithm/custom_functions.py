def sort_dict(dic, item="value", reverse=True):
    if item.lower().startswith("v"):
        if reverse:
            return sorted(dic.items(), key=lambda x:x[1], reverse=True)
        else:
            return sorted(dic.items(), key=lambda x:x[1], reverse=False)
    if item.lower().startswith("k"):
        if reverse:
            return sorted(dic.items(), key=lambda x:x[0], reverse=True)
        else:
            return sorted(dic.items(), key=lambda x:x[0], reverse=False)

def random_sample(population, sample_size):
    import random
    
    if len(population)>sample_size:
        return random.sample(population, sample_size)
    else:
        return population