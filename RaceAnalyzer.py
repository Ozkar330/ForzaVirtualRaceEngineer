import pandas as pd
import numpy as np
import plotly.graph_objs as go
from dash import Dash, dcc, html, Input, Output

# Cargar datos
df = pd.read_csv("All_Data.csv")

# Inicializar app
app = Dash(__name__)

# Layout con selector de vuelta
app.layout = html.Div([
    html.H1("Análisis de Telemetría - Forza Motorsport 8"),
    html.Label("Selecciona una vuelta:"),
    dcc.Dropdown(
        id="lap-selector",
        options=[{"label": f"Vuelta {lap}", "value": lap} for lap in sorted(df["lap_num"].unique())],
        value=sorted(df["lap_num"].unique())[0]
    ),
    dcc.Graph(id="track-graph"),
    html.Div(id="point-info", style={"marginTop": 20})
])

# Callback para actualizar gráfico
@app.callback(
    Output("track-graph", "figure"),
    Input("lap-selector", "value")
)
def update_graph(selected_lap):
    fig = go.Figure()
    lap_data = df[df["lap_num"] == selected_lap]

    customdata_array = lap_data[["speed", "throttle", "brake", "gear_num", "race_time", "lap_num"]].values.tolist()

    fig.add_trace(go.Scatter(
        x=lap_data["position_x"],
        y=lap_data["position_z"],
        mode="markers",
        marker=dict(size=4),
        name=f"Lap {selected_lap}",
        customdata=customdata_array,
        hovertemplate=(
            "X: %{x}<br>Z: %{y}<br>"
            "Speed: %{customdata[0]:.2f} km/h<br>"
            "Throttle: %{customdata[1]:.2f}<br>"
            "Brake: %{customdata[2]:.2f}<br>"
            "Gear: %{customdata[3]}<br>"
            "Race Time: %{customdata[4]:.2f} s<br>"
            "Lap: %{customdata[5]}<extra></extra>"
        )
    ))

    fig.update_yaxes(range=[-1400, 1400])
    fig.update_xaxes(range=[-1800, 1800])
    fig.update_layout(title=f"Trayectoria - Vuelta {selected_lap}")

    return fig

# Callback para mostrar información del punto
@app.callback(
    Output("point-info", "children"),
    Input("track-graph", "clickData")
)
def show_point_info(clickData):
    if not clickData or "points" not in clickData:
        return "Haz clic en un punto para ver los datos de telemetría."

    data = clickData["points"][0]["customdata"]
    if not data:
        return "No se pudo obtener la información del punto."

    return html.Ul([
        html.Li(f"Velocidad: {data[0]:.2f} km/h"),
        html.Li(f"Acelerador: {data[1]:.2f}"),
        html.Li(f"Freno: {data[2]:.2f}"),
        html.Li(f"Marcha: {int(data[3])}"),
        html.Li(f"Tiempo de carrera: {data[4]:.2f} s"),
        html.Li(f"Vuelta: {int(data[5])}")
    ])

if __name__ == "__main__":
    app.run(debug=True)
