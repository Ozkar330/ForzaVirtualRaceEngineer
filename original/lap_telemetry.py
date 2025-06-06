import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("All_Data.csv")
df = df[df['dist_traveled'] > 0]
df = df[df['lap_num'] == 1]

fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, sharex=True)
fig.suptitle('Lap Telemetry')
ax1.plot(df['dist_traveled'], df['speed'])
ax2.plot(df['dist_traveled'], df['throttle'])
ax3.plot(df['dist_traveled'], df['brake'])
ax4.plot(df['dist_traveled'], df['steering_angle'])
ax4.set_xlabel('Distance')
ax1.set_ylabel('Speed')
ax2.set_ylabel('Throttle')
ax3.set_ylabel('Brake')
ax4.set_ylabel('Steering')

fig.subplots_adjust(left=0.042, bottom=0.062, right=0.985, top=0.93)

fig.set_figwidth(18)
fig.set_figheight(9)
plt.show()