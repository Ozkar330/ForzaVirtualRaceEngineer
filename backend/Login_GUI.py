import tkinter as tk
import webbrowser
from tkinter import messagebox
from CognitoHandler import CognitoHandler


class Login_GUI:
    def __init__(self):
        self.cognito_handler = None
        self.local_ip = None
        self.local_port = None
        self.root = tk.Tk()
        self.show_login_window()


    def show_login_window(self):
        # Crear ventana de Login
        self.root.title("Virtual Race Engineer")
        self.root.geometry("400x200")

        tk.Label(self.root, text="Usuario:").pack(pady=(10, 0))
        entry_user = tk.Entry(self.root)
        entry_user.pack()

        tk.Label(self.root, text="Contraseña:").pack(pady=(10, 0))
        entry_pass = tk.Entry(self.root, show="*")
        entry_pass.pack()

        tk.Button(self.root, text="Iniciar sesión", command=self.on_login).pack(pady=20)

        self.root.mainloop()


    # Nueva ventana post-login
    def show_main_window(self):
        # Limpiar la ventana
        for widget in self.root.winfo_children():
            widget.destroy()

        self.root.geometry("400x300")
        self.root.title("Virtual Race Engineer")

        attributes = self.cognito_handler.get_user_attributes()

        # Mostrar nombre/correo del usuario
        tk.Label(self.root, text=f"Bienvenido, {attributes["email"]}!", font=("Arial", 12)).pack(pady=(10, 10))

        tk.Label(self.root, text="Dirección IP:").pack(pady=(10, 0))
        ip_entry = tk.Entry(self.root)
        ip_entry.pack()

        tk.Label(self.root, text="Puerto:").pack(pady=(10, 0))
        port_entry = tk.Entry(self.root)
        port_entry.pack()

        def open_web_interface():
            webbrowser.open("http://localhost:5173")

        def save_config():
            self.local_ip = ip_entry.get()
            self.local_port = port_entry.get()
            self.root.destroy()

        tk.Button(self.root, text="Guardar", command=save_config).pack(pady=10)
        tk.Button(self.root, text="Abrir interfaz web213", command=open_web_interface).pack(pady=10)



    # Función que se ejecuta al presionar "Iniciar sesión"
    def on_login(self):
        # username = entry_user.get()
        # password = entry_pass.get()

        username = "eangeles"
        password = "5BbwQm3VvxAj87X!"

        tokens = None

        try:
            self.cognito_handler = CognitoHandler(username, password)
            tokens = self.cognito_handler.login()

            #messagebox.showinfo("Login exitoso", f"Access token:\n{tokens['AccessToken'][:50]}...")
            self.show_main_window()
        except Exception as e:
            messagebox.showerror("Error de autenticación", str(e))




