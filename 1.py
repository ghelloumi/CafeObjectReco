import argparse
def sayhello(message):
  print (message)
 
if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--msg', type=str, default='sample.jpg')
  args = parser.parse_args()
  sayhello(args.msg)
