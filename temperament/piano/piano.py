from PyQt6.QtWidgets import QApplication, QMainWindow, QLabel, QPushButton, QVBoxLayout, QStackedWidget, QWidget, QMenuBar, QMenu
from PyQt6.QtGui import QAction
from PyQt6.QtCore import Qt

class Pantalla(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Interfaz con PyQt6")
        self.setGeometry(100, 100, 1080, 720)

        # Configuración del menú
        self.menu_bar = QMenuBar(self)
        self.setMenuBar(self.menu_bar)

        self.modos_menu = QMenu("Modos", self)
        self.menu_bar.addMenu(self.modos_menu)

        self.modo1_action = QAction("Modo 1", self)
        self.modo2_action = QAction("Modo 2", self)
        self.modo3_action = QAction("Modo 3", self)
        self.modo4_action = QAction("Modo 4", self)

        self.modos_menu.addAction(self.modo1_action)
        self.modos_menu.addAction(self.modo2_action)
        self.modos_menu.addAction(self.modo3_action)
        self.modos_menu.addAction(self.modo4_action)

        # Conectar acciones del menú
        self.modo1_action.triggered.connect(lambda: self.cambiar_seccion(0))
        self.modo2_action.triggered.connect(lambda: self.cambiar_seccion(1))
        self.modo3_action.triggered.connect(lambda: self.cambiar_seccion(2))
        self.modo4_action.triggered.connect(lambda: self.cambiar_seccion(3))

        # Configuración de las secciones
        self.stack = QStackedWidget()

        self.seccion1 = self.crear_seccion("Sección Modo 1")
        self.seccion2 = self.crear_seccion("Sección Modo 2")
        self.seccion3 = self.crear_seccion("Sección Modo 3")
        self.seccion4 = self.crear_seccion("Sección Modo 4")

        self.stack.addWidget(self.seccion1)
        self.stack.addWidget(self.seccion2)
        self.stack.addWidget(self.seccion3)
        self.stack.addWidget(self.seccion4)

        self.setCentralWidget(self.stack)

    def crear_seccion(self, texto):
        widget = QWidget()
        layout = QVBoxLayout()

        label = QLabel(texto, self)
        label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(label)

        widget.setLayout(layout)
        return widget

    def cambiar_seccion(self, indice):
        self.stack.setCurrentIndex(indice)

if __name__ == "__main__":
    app = QApplication([])
    ventana = Pantalla()
    ventana.show()
    app.exec()
