from libc.math cimport pow, sqrt, fabs, floor
cdef extern from "math.h":
    double sqrt(double m)
from cpython cimport array
import array
from numpy cimport ndarray
cimport numpy as np
cimport cython

cdef double calculate(double top, double bl, double br):
    cdef double result
    result = top / sqrt(bl*br)
    return result

cdef double amplification( double korelasyon):
    cdef double alpha, change, finalWeight
    change = (0.6 - korelasyon)
    alpha = 1 - (change/2.0)
    finalWeight = pow(korelasyon, alpha)
    return finalWeight

def carray(list values):
    cdef array.array  arr = array.array("d", values)
    cdef double[:] ca = arr
    return ca


def intersection(dict d1, dict d2):
    cdef list commons = []
    cdef list keys1 = list(d1.keys())
    cdef list keys2 = list(d2.keys())
    cdef str movid
    for movid in keys1:
        if movid in keys2:
            commons.append(movid)
    return commons


def intersection_with_dict(dict d1, dict d2):
    cdef set keys1 = set(d1.keys())
    cdef set keys2 = set(d2.keys())
    return keys1.intersection(keys2)

def intersection_with_set(set s1, set s2):
    return s1.intersection(s2)


def intersection_set_quantity(dict d1, dict d2):
    cdef set keys1 = set(d1.keys())
    cdef set keys2 = set(d2.keys())
    cdef unsigned int quantity = len(keys1.intersection(keys2))
    return quantity

@cython.wraparound(False)
@cython.boundscheck(False)
def mean(double[:] ca):
    cdef long i
    cdef unsigned int size = ca.size
    cdef double total=0.0
    for i in range(size):
        total += ca[i]
    return total / size

@cython.wraparound(False)
@cython.boundscheck(False)
def mean_from_dict(dict d1):
    cdef unsigned int size = len(d1.keys())
    cdef list keys = list(d1.keys())
    cdef str movie_id
    cdef double total=0.0
    for movie_id in keys:
        total += d1.get(movie_id)
    return total / size

@cython.wraparound(False)
@cython.boundscheck(False)
def variance(double[:] ca):
    cdef double sum = 0.0
    cdef double result, ubar
    cdef long i
    ubar = mean(ca)
    for i in range(ca.size):
        sum += pow(ca[i] -ubar, 2)
    result = sum / ca.size
    return result


@cython.wraparound(False)
@cython.boundscheck(False)
def stdev(double [:] ca):
    cdef double result
    cdef double varyans = variance(ca)
    result = sqrt(varyans)
    return result


@cython.wraparound(False)
@cython.boundscheck(False)
def pearson(double [:] u_array, double [:] v_array, double ubar, double vbar):
    cdef double top=0.0, bl=0.0, br=0.0
    cdef double result, ui, vi
    cdef unsigned int size = u_array.size
    cdef long i
    for i in range(size):
        ui = u_array[i]
        vi = v_array[i]

        top += (ui - ubar) * (vi - vbar)
        bl += (ui - ubar)**2
        br += (vi - vbar)**2
    if bl* br==0:
        return 0
    result = calculate(top, bl, br)
    return result


def mean_score(double [:] v_ratings, double [:] v_bars, double [:] v_sims):
    cdef double vbar, correlation, rate, result
    cdef double top=0.0, sum_of_correlation=0.0
    cdef long i
    cdef unsigned int size = v_ratings.size
    for i in range(size):
        rating = v_ratings[i]
        mean = v_bars[i]
        correlation = amplification(v_sims[i])

        top += correlation * (rating - mean)
        sum_of_correlation += fabs(correlation)

    if sum_of_correlation!=0:
        return top / sum_of_correlation
    else:
        print("final function: top/sum_of_correlation = 0")
        return -10


def z_score(double [:] v_ratings, double [:] v_bars, double [:] v_sims, double [:] v_stdevs):
    cdef double vbar, correlation, rate, deviation, result
    cdef double top=0.0, sum_of_correlation=0.0
    cdef long i
    cdef unsigned int size = v_ratings.size
    for i in range(size):
        rating = v_ratings[i]
        mean = v_bars[i]
        correlation = amplification(v_sims[i])
        deviation = v_stdevs[i]

        top += correlation * ((rating - mean)/deviation)
        sum_of_correlation += fabs(correlation)

    if sum_of_correlation!=0:
        return top / sum_of_correlation
    else:
        print("final function: top/sum_of_correlation = 0")
        return -10





"""

from libc.math cimport pow, sqrt, fabs, floor
cdef extern from "math.h":
    double sqrt(double m)
from cpython cimport array
import array
from numpy cimport ndarray
cimport numpy as np
cimport cython

cdef double calculate(double top, double bl, double br):
    cdef double result
    result = top / sqrt(bl*br)
    return result

cdef double amplification( double korelasyon):
    cdef double alpha, change, finalWeight
    change = (0.6 - korelasyon)
    alpha = 1 - (change/2.0)
    finalWeight = pow(korelasyon, alpha)
    return finalWeight

def carray(list values):
    cdef array.array  arr = array.array("d", values)
    cdef double[:] ca = arr
    return ca


@cython.wraparound(False)
@cython.boundscheck(False)
def mean(double[:] ca):
    cdef long i
    cdef unsigned int size = ca.size
    cdef double total=0.0
    for i in range(size):
        total += ca[i]
    return total / size

@cython.wraparound(False)
@cython.boundscheck(False)
def variance(double[:] ca):
    cdef double sum = 0.0
    cdef double result, ubar
    cdef long i
    ubar = mean(ca)
    for i in range(ca.size):
        sum += pow(ca[i] -ubar, 2)
    result = sum / ca.size
    return result


@cython.wraparound(False)
@cython.boundscheck(False)
def stdev(double [:] ca):
    cdef double result
    cdef double varyans = variance(ca)
    result = sqrt(varyans)
    return result


@cython.wraparound(False)
@cython.boundscheck(False)
def pearson(double [:] u_array, double [:] v_array, double ubar, double vbar):
    cdef double top=0.0, bl=0.0, br=0.0
    cdef double result, ui, vi
    cdef unsigned int size = u_array.size
    cdef long i
    for i in range(size):
        ui = u_array[i]
        vi = v_array[i]

        top += (ui - ubar) * (vi - vbar)
        bl += (ui - ubar)**2
        br += (vi - vbar)**2
    if bl* br==0:
        return 0
    result = calculate(top, bl, br)
    return result


def mean_score(double [:] v_ratings, double [:] v_bars, double [:] v_sims):
    cdef double vbar, correlation, rate, result
    cdef double top=0.0, sum_of_correlation=0.0
    cdef long i
    cdef unsigned int size = v_ratings.size
    for i in range(size):
        rating = v_ratings[i]
        mean = v_bars[i]
        correlation = amplification(v_sims[i])

        top += correlation * (rating - mean)
        sum_of_correlation += fabs(correlation)

    if sum_of_correlation!=0:
        return top / sum_of_correlation
    else:
        print("final function: top/sum_of_correlation = 0")
        return -10


def z_score(double [:] v_ratings, double [:] v_bars, double [:] v_sims, double [:] v_stdevs):
    cdef double vbar, correlation, rate, deviation, result
    cdef double top=0.0, sum_of_correlation=0.0
    cdef long i
    cdef unsigned int size = v_ratings.size
    for i in range(size):
        rating = v_ratings[i]
        mean = v_bars[i]
        correlation = amplification(v_sims[i])
        deviation = v_stdevs[i]

        top += correlation * ((rating - mean)/deviation)
        sum_of_correlation += fabs(correlation)

    if sum_of_correlation!=0:
        return top / sum_of_correlation
    else:
        print("final function: top/sum_of_correlation = 0")
        return -10

"""