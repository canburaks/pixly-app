import concurrent.futures
from queue import Queue
import threading

class MyQueue:
    q = Queue()

    @classmethod
    def put(cls, func, *args, **kwargs):
        #Look if its empty, run it, otherwise also will be processed
        if cls.q.unfinished_tasks == 0:
            print(f"Queue is empty function will be added and then a new thread will be started.")
            cls.q.put([func, args, kwargs])
            t = threading.Thread(target=cls.get, daemon=True)
            t.start()
            return True

        else:
            cls.q.put([func, args, kwargs])
            print("There already items in the queue. The function will wait its turn")
        #threaded(cls.get)
        #cls.get()
    
    @classmethod
    def get(cls):
        while cls.q.unfinished_tasks > 0:
            mission = cls.q.get()
            #print("<-----------------GET-------------------->")
            print("mission brought from queue")
            function = mission[0]
            function( *mission[1], **mission[2] )
            cls.q.task_done()

    @classmethod
    def do(cls):
        print("<---------------------DO------------------->")
        t = threading.Thread(target=cls.get, daemon=True)
        t.start()
        t.join()
        print("Threaded function started and going on background")

