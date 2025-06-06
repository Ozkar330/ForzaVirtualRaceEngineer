import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv("All_Data.csv")
df = df[df['dist_traveled'] > 0]
df = df[df['lap_num'] == 1]

fig, ax = plt.subplots()
fig.suptitle('Track Layout')
ax.plot(df['position_x'], df['position_z'])
ax.set_aspect("equal", adjustable="datalim")
ax.set_box_aspect(0.5)
ax.autoscale()

plt.show()