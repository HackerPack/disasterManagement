from firebase import firebase
firebase = firebase.FirebaseApplication('https://hoyadisastermanagement.firebaseio.com/',None)

#new_user = 'Ozgur Vatansever'
#result = firebase.post('/users', new_user)
#print result

newhashtag = {'#ChennaiFloods', '693456602918227968'}
result = firebase.post('/twitterhashtags', newhashtag)
print result

newhashtag = {'#SnowStorm', '693457238711799808'}
result = firebase.post('/twitterhashtags', newhashtag)
print result

newhashtag = {'#ParisAttacks', '693458052176072704'}
result = firebase.post('/twitterhashtags', newhashtag)
print result
