from pyspark import SparkConf, SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
import operator
import numpy as np
import matplotlib.pyplot as plt
import nltk
import requests
import json 
import commands
from HTMLParser import HTMLParser

def main():
    conf = SparkConf().setMaster("local[2]").setAppName("Streamer")
    sc = SparkContext(conf=conf)
    ssc = StreamingContext(sc, 10)   # Create a streaming context with batch interval of 10 sec
    ssc.checkpoint("checkpoint")
   
    stream(ssc,100) 



def analyse(tweet):
    OriginalTweet,Location,TimeOfTweet = tweet.split('---')
    TaskType = ""
    Taken = "0"
    Finished = "0"
    Priority = "0"
    tweetDict = {}
    if 'available' in OriginalTweet or 'need' in OriginalTweet :
        TaskType = 'GOODS'  
    if 'missing' in OriginalTweet:
        TaskType = 'MISSING'
    if 'SOS' in OriginalTweet:
        TaskType = 'SOS'
    if 'ambulance' in OriginalTweet:
        TaskType = 'AMBULANCE'
        Priority = '10'
    else:
        TaskType = 'UNKNOWN'
    if 'emergency' in OriginalTweet:
        Priority = '10'
    tweetDict['TaskType'] = TaskType
    #tweetDict['Disaster'] = Disaster
    tweetDict['Taken'] = Taken
    tweetDict['Finished'] = Finished
    tweetDict['OriginalTweet'] = OriginalTweet
    tweetDict['Location'] = Location
    tweetDict['TimeOfTweet'] = TimeOfTweet
    tweetDict['Priority'] = Priority
    jsons = json.dumps(tweetDict)
    requests.post('http://hoyadisastermanagement.firebaseio.com/tasks2',json.dumps(tweetDict))
    command = "curl -X PUT -d '" + str(jsons) + "' 'https://hoyadisastermanagement.firebaseio.com/tasks2.json'"
    run_command = commands.getstatusoutput(command)
    return 1
    


def stream(ssc, duration):
    kstream = KafkaUtils.createDirectStream(
        ssc, topics = ['twitterstream'], kafkaParams = {"metadata.broker.list": 'localhost:9092'})
    tweets = kstream.map(lambda x: x[1].encode("ascii","ignore"))
    # Each element of tweets will be the text of a tweet.
    # You need to find the count of all the positive and negative words in these tweets.
    # Keep track of a running total counts and print this at every time step (use the pprint function).
    # YOUR CODE HERE
    tweets.pprint()
    tweetDstream = tweets.map(lambda line: analyse(line))
    tweetDstream.pprint(2)
    #tweetDstream.pprint(2)    
    # Let the counts variable hold the word counts for all time steps
    # You will need to use the foreachRDD function.
    # For our implementation, counts looked like:
    #   [[("positive", 100), ("negative", 50)], [("positive", 80), ("negative", 60)], ...]
    counts = []
   # tweetDstream.foreachRDD(lambda rdd: rdd.collect())
    
    ssc.start()                         # Start the computation
    ssc.awaitTerminationOrTimeout(duration)
    ssc.stop(stopGraceFully=True)

    return counts


if __name__=="__main__":
    main()
