import plotly.graph_objects as go
# import plotly.express as px
import pandas as pd

# This script creates an interactive 3D chart of the racing line data from a specified folder.
# Unfortunately, Plotly doesn't work super easily with animations, so this script will only output an interactive chart, not a .gif file.

# References
# https://plotly.com/python/animations/
# https://plotly.com/python/#animations
# https://plotly.com/python/visualizing-mri-volume-slices/
# https://plotly.com/python/animations/

# Create and offset the racing line
def create_racing_line(filename, xOffset, yOffset, zOffset, color):
    df = pd.read_csv(filename)
    return go.Scatter3d(
        x=df['position_x'] + xOffset, # offset moves all the points by some amount and allows you to manually center a racing line in the chart
        y=df['position_z'] + yOffset, 
        z=df['position_y'] + zOffset, 
        name=filename,
        line=dict(
            width=1,
            color=color
        ),
        marker=dict(
            size=1
        ))

# Set file to read
filename = "All_Data.csv"

# set the chart bounds
# these values should typically be ~10% bigger than the bounds of the paths you are drawing,
# for instance, if a track has dimensions of 1000x1000x10 meters and is centered around the origin (0,0,0), then your bounds should be:
# x: -550, 550
# y: -550, 550
# x: -5.5, 5.5
map_bounds = dict(
        xaxis=dict(range=[-1000,1400]),
        yaxis=dict(range=[-1000,1400]),
        zaxis=dict(range=[-100,100])
)

# create plot
fig = go.Figure()
fig.update_yaxes(gridwidth=0)
#fig.layout.template = 'plotly_dark' # enable for dark mode
fig.update_layout(scene=map_bounds)

fig.add_trace(create_racing_line(filename,0,0,0,'blue'))

# show plot
fig.show()