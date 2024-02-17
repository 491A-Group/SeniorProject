#All code written by Le Duong, unless stated otherwise 
import numpy as np
import os
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import keyboard
import threading

# Le Duong 
# Script runs image viewer window that pulls car images to sort through and clean image set for each car model/make

imagePath = "" 
ex = False

# Le Duong
# Load the image
def key_listener():
    global ex
    print("Press 'q' for 'trash' or 'p' for 'keep'...")

    # Le Duong
    # presents user key button options to sort images
    while True:
        #disables keybord while image viewer is running
        event = keyboard.read_event(suppress=True)

        if event.event_type == keyboard.KEY_DOWN:
            # q deletes image
            if event.name == 'q':
                os.remove(imagePath)
                break
            # p keeps image
            elif event.name == 'p':
                print("keep")
                break
            # x exits out of image viewer
            elif event.name == 'x':
                print("exiting")
                ex = True
                break

    plt.close()


# Le Duong
# Folder path where car images are to be pulled for image viewer to be sorted
folderPath = "C:/Users/LeNDu/OneDrive/Documents/CS/CECS 491A Senior Project/RoboFlow/Cars/TESLA/TESLA Model S (2012-2016)/"
count = 0
total = len(os.listdir(folderPath))

for file in os.listdir(folderPath):
    if not ex:
        try:
            # Le Duong
            # Function to capture keyboard input
            # Load an image using Matplotlib
            imagePath = folderPath+file
            image = mpimg.imread(folderPath+file)

            # Le Duong
            # Create a thread for keyboard input
            keyboard_thread = threading.Thread(target=key_listener)
            keyboard_thread.daemon = True  # This allows the thread to exit when the main program exits

            # Le Duong
            # Start the keyboard input thread
            keyboard_thread.start()

            # Le Duong
            # Display the image in the main thread
            plt.imshow(image)
            plt.title("Loaded Image " + str(count) + " of " + str(total))
            plt.axis('off')
            plt.show()

        except Exception as e:
            print("ERROR:", file)
            os.remove(folderPath+file)
    
        count += 1