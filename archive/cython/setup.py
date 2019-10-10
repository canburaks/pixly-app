#from distutils.core import setup
#from Cython.Build import cythonize

#setup(ext_modules = cythonize('Ops.pyx', annotate=True))
# in command panel:    python setup.py build_ext --inplace
from distutils.core import setup
from Cython.Build import cythonize
import numpy

setup(ext_modules = cythonize('cfunc.pyx', annotate=True,gdb_debug=True),
      include_dirs=[numpy.get_include(),"."]
)
