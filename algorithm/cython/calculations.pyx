from libc.math cimport pow, sqrt, fabs, floor
cdef extern from "math.h":
    double sqrt(double m)

from numpy cimport ndarray
cimport numpy as np
cimport cython

@cython.boundscheck(False)
def mean(dict ratings):
    cdef double u
    cdef double total=0.0
    cdef unsigned int num = 0
    for u in ratings.values():
        total += u
        num += 1
    return total / num

@cython.boundscheck(False)
def variance(dict ratings):
    ubar = mean(ratings)
    cdef double u
    cdef double sum = 0.0
    cdef unsigned int len =0
    for i in ratings.values():
        sum += pow(i-ubar, 2)
        len +=1
    if len>0:
        return sum / len
    else:
        print("function Variance has no length!! ")
        return 0

def stdev(dict ratings):
    cdef double varyans = variance(ratings)
    return sqrt(varyans)

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

@cython.boundscheck(False)
def pearson(ndarray[np.float64_t, ndim=1] arru not None, 
            ndarray[np.float64_t, ndim=1] arrv not None, 
            double ubar, double vbar):
    cdef Py_ssize_t i
    cdef double v
    cdef double u
    cdef Py_ssize_t r = arru.shape[0]

    cdef double top = 0.0
    cdef double bl = 0.0
    cdef double br = 0.0

    for i in range(r):
        top += (arru[i] - ubar) * (arrv[i] - vbar)
        bl += pow(arru[i] - ubar, 2)
        br += pow(arrv[i] - vbar, 2)
    if bl*br!=0:
        return calculate(top, bl, br)
    else:
        return 0


def final(list userlist):
    cdef list single_user
    cdef double vbar, correlation, rate, result
    cdef double top=0.0, sum_of_correlation=0.0

    for single_user in userlist:
        vbar = single_user[0]
        rate = single_user[1]
        correlation = amplification(single_user[2])

        top += correlation*(rate - vbar)
        sum_of_correlation += fabs(correlation)

    if sum_of_correlation!=0:
        return top / sum_of_correlation
    else:
        print("final function: top/sum_of_correlation = 0")
        return 0

def z_final(list userlist):
    cdef list single_user
    cdef double vbar, vstdev, correlation, rate, result
    cdef double top=0.0, sum_of_correlation=0.0

    for single_user in userlist:
        vbar = single_user[0]
        vstdev = single_user[1]
        rate = single_user[2]
        correlation = amplification(single_user[3])

        top += correlation*(rate - vbar)/vstdev
        sum_of_correlation += fabs(correlation)

    if sum_of_correlation!=0:
        return top / sum_of_correlation
    else:
        print("final function: top/sum_of_correlation = 0")
        return 0

def acs(list collection):
    cdef tuple user_rates
    cdef unsigned int length = len(collection)
    cdef Py_ssize_t i 
    
    cdef double top = 0.0
    cdef double bl = 0.0
    cdef double br = 0.0

    for i in range(length):
        user_rates = collection[i]
        top += (user_rates[1] - user_rates[0]) * (user_rates[2] - user_rates[0])
        bl += pow(user_rates[1] - user_rates[0], 2)
        br += pow(user_rates[2] - user_rates[0], 2)
    
    if bl*br!=0:
        return calculate(top, bl, br)
    else:
        return 0