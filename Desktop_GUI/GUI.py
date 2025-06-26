import tkinter as tk
from tkinter import messagebox
from CognitoHandler import CognitoHandler as ch


# Función que se ejecuta al presionar "Iniciar sesión"
def on_login():
    username = entry_user.get()
    password = entry_pass.get()

    try:
        # tokens = login_user(username, password)
        tokens = ch(username, password).login()
        messagebox.showinfo("Login exitoso", f"Access token:\n{tokens['AccessToken'][:50]}...")
    except Exception as e:
        messagebox.showerror("Error de autenticación", str(e))

# Crear ventana
root = tk.Tk()
root.title("Login con Cognito AWS")
root.geometry("300x200")

# Widgets
tk.Label(root, text="Usuario:").pack(pady=(10, 0))
entry_user = tk.Entry(root)
entry_user.pack()

tk.Label(root, text="Contraseña:").pack(pady=(10, 0))
entry_pass = tk.Entry(root, show="*")
entry_pass.pack()

tk.Button(root, text="Iniciar sesión", command=on_login).pack(pady=20)

root.mainloop()
