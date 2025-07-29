import tkinter as tk
import webbrowser
from tkinter import messagebox
from CognitoHandler import CognitoHandler


# def open_url(ip, port):
#     url = f"http://{ip}:{port}"
#     webbrowser.open(url)

# Nueva ventana post-login
def show_main_window(ch: CognitoHandler):
    # Limpiar la ventana
    for widget in root.winfo_children():
        widget.destroy()

    root.geometry("400x200")
    root.title("Virtual Race Engineer")

    attributes = ch.get_user_attributes()

    # Mostrar nombre del usuario
    tk.Label(root, text=f"Bienvenido, {attributes["email"]}!", font=("Arial", 12)).pack(pady=(10, 10))

    tk.Label(root, text="Dirección IP de XBOX:").pack(pady=(10, 0))
    ip_entry = tk.Entry(root)
    ip_entry.pack()

    tk.Label(root, text="Puerto:").pack(pady=(10, 0))
    port_entry = tk.Entry(root)
    port_entry.pack()

    def open_web_interface():
        webbrowser.open("http://localhost:5173")

    tk.Button(root, text="Abrir interfaz web", command=open_web_interface).pack(pady=10)

# Función que se ejecuta al presionar "Iniciar sesión"
def on_login():
    # username = entry_user.get()
    # password = entry_pass.get()

    username = "eangeles"
    password = "5BbwQm3VvxAj87X!"

    tokens = None

    try:
        # tokens = login_user(username, password)
        ch = CognitoHandler(username, password)
        tokens = ch.login()

        #messagebox.showinfo("Login exitoso", f"Access token:\n{tokens['AccessToken'][:50]}...")
        show_main_window(ch)
    except Exception as e:
        messagebox.showerror("Error de autenticación", str(e))


# Crear ventana
root = tk.Tk()
root.title("Virtual Race Engineer")
root.geometry("400x200")

# Widgets
tk.Label(root, text="Usuario:").pack(pady=(10, 0))
entry_user = tk.Entry(root)
entry_user.pack()

tk.Label(root, text="Contraseña:").pack(pady=(10, 0))
entry_pass = tk.Entry(root, show="*")
entry_pass.pack()

tk.Button(root, text="Iniciar sesión", command=on_login).pack(pady=20)

root.mainloop()

wait