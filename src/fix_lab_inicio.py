import os

def fix_file(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()

    # 1. Encoding fixes (common double-UTF-8 glitches)
    repls = [
        (b'MISI\xc3\x83\xe2\x80\x9c', b'MISI\xc3\x93'), # MISIÓN
        (b'm\xc3\x83\xc2\xa1ssion', b'mission'),       # mássion -> mission
        (b'Misi\xc3\x83\xc2\xb3n', b'Misi\xc3\xb3n'),  # Misión
        (b'misi\xc3\x83\xc2\xb3n', b'misi\xc3\xb3n'),  # misión
        (b'¿QU\xc3\x83\xe2\x80\x9c', b'¿QU\xc3\x89'),   # ¿QUÉ
        (b'C\xc3\x83\xe2\x80\x9cMO', b'C\xc3\x93MO'),   # CÓMO
        (b'¿POR QU\xc3\x83\xe2\x80\x9c', b'¿POR QU\xc3\x89'), # ¿POR QUÉ
        (b'enriqu\xc3\x83\xc2\xa9cido', b'enriquecido'), # enriquecido
        (b'desbloqu\xc3\x83\xc2\xa9as', b'desbloqueas'), # desbloqueas
        (b'desbloqu\xc3\x83\xc2\xa9ables', b'desbloqueables'), # desbloqueables
        (b'im\xc3\x83\xc2\xa1genes', b'im\xc3\xa1genes'), # imágenes
        (b'\xc3\x82\xc2\xb7', b'\xc2\xb7'),             # middle dot
        (b'\xc3\x83\xe2\x80\x94', b'\xe2\x80\x94'),     # em dash
        (b'qu\xc3\x83\xc2\xa9', b'qu\xc3\xa9'),         # qué
        (b'requ\xc3\x83\xc2\xa9ere', b'requiere'),       # requiere
        (b'prop\xc3\x83\xc2\xb3sito', b'prop\xc3\xb3sito'), # propósito
        (b'pedag\xc3\x83\xc2\xb3gica', b'pedag\xc3\xb3gica'), # pedagógica
        (b't\xc3\x83\xc2\xa9cnica', b't\xc3\xa9cnica'), # técnica
        (b'tecnolog\xc3\x83\xc2\xada', b'tecnolog\xc3\xada'), # tecnología
        (b'f\xc3\x83\xc2\xadsico', b'f\xc3\xadsico'),     # físico
        (b'Ã\x81rea', b'\xc3\x81rea'),                  # Área
        (b'\xc3\x83\xc2\x81rea', b'\xc3\x81rea'),
        (b'Ãºnico', b'\xc3\xbanico'),                   # único
        (b'Ãºnica', b'\xc3\xbanica'),
    ]

    for old, new in repls:
        content = content.replace(old, new)

    # 2. Icon fixes (Specific broken emoji bytes found in the file)
    # Based on view_file output: ðŸ§­ (Compass), ðŸ”¬ (Microscope), etc.
    emoji_repls = [
        (b'\xc3\xb0\xc5\xb8\xc2\xa7\xc2\xad', b'\xf0\x9f\xa7\xad'), # 🧭
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9d\xc2\xac', b'\xf0\x9f\x94\xac'), # 🔬
        (b'\xc3\xb0\xc5\xb8\xc2\xab', b'\xf0\x9f\x8f\xab'),           # 🏫
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x94\xc2\xba\xc3\xaf\xc2\xb8\xc2\x8f', b'\xf0\x9f\x97\xba\xef\xb8\x8f'), # 🗺️
        (b'\xc3\xb0\xc5\xb8\xe2\x80\xa0', b'\xf0\x9f\x8f\x86'),       # 🏆 (ðŸ †)
        (b'\xc3\xb0\xc5\xb8\xc5\x92\xc2\x8d', b'\xf0\x9f\x8c\x8d'), # 🌍 (ðŸŒ )
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\xa1', b'\xf0\x9f\x93\xa1'), # 📡 (ðŸ“¡)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x98\xc2\x81\xc3\xaf\xc2\xb8\xc2\x8f', b'\xf0\x9f\x91\x81\xef\xb8\x8f'), # 👁️ (ðŸ‘ ï¸ )
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9d\xc2\x80', b'\xf0\x9f\x94\x80'), # 🔀 (ðŸ”€)
        (b'\xc3\xb0\xc5\xb8\xc2\xa5\xc2\xbd', b'\xf0\x9f\xa5\xbd'), # 🥽 (ðŸ¥½)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\xb7', b'\xf0\x9f\x93\xb7'), # 📷 (ðŸ“·)
        (b'\xc3\xb0\xc5\xb8\xc2\xa7\xc2\xa0', b'\xf0\x9f\xa7\xa0'), # 🧠 (ðŸ§ )
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x93\xc2\xa5\xc3\xaf\xc2\xb8\xc2\x8f', b'\xf0\x9f\x96\xa5\xef\xb8\x8f'), # 🖥️ (ðŸ–¥ï¸ )
        (b'\xc3\xb0\xc5\xb8\xc2\x8e\xc2\xaf', b'\xf0\x9f\x8e\xaf'), # 🎯 (ðŸŽ¯)
        (b'\xc3\xb0\xc5\xb8\xc2\xa7\xc5\xa0', b'\xf0\x9f\xa7\x8a'), # 🧊 (ðŸ§Š)
        (b'\xc3\xb0\xc5\xb8\xc2\x8e\xc2\xa8', b'\xf0\x9f\x8e\xa8'), # 🎨 (ðŸŽ¨)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x94\xc2\xba', b'\xf0\x9f\x97\xba'), # 🗺️
        (b'\xc3\xb0\xc5\xb8\xc2\x9a\xc2\x80', b'\xf0\x9f\x9a\x80'), # 🚀 (ðŸš€)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\xb1', b'\xf0\x9f\x93\xb1'), # 📱 (ðŸ“±)
        (b'\xc3\xb0\xc5\xb8\xc2\xa5\xc2\x87', b'\xf0\x9f\xa5\x87'), # 🥇 (ðŸ¥‡)
        (b'\xc3\xb0\xc5\xb8\xc2\xa5\xc2\x88', b'\xf0\x9f\xa5\x88'), # 🥈 (ðŸ¥ˆ)
        (b'\xc3\xb0\xc5\xb8\xc2\xa5\xc2\x89', b'\xf0\x9f\xa5\x89'), # 🥉 (ðŸ¥‰)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9d\xc2\x8e', b'\xf0\x9f\x94\x8e'), # 🔎 (ðŸ”Ž)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\xa3', b'\xf0\x9f\x93\xa3'), # 📢 (ðŸ“£)
        (b'\xc3\xb0\xc5\xb8\xe2\x80\x9c\xc2\x8c', b'\xf0\x9f\x93\x8c'), # 📌 (ðŸ“ )
    ]

    for old, new in emoji_repls:
        content = content.replace(old, new)

    # 3. Mission count and specific mission removal
    # Change "7 misiones" to "6 misiones"
    content = content.replace(b'7 misiones', b'6 misiones')
    content = content.replace(b'Mapa de 7 misiones', b'Mapa de 6 misiones')
    content = content.replace(b'Ruta de 7 misiones', b'Ruta de 6 misiones')

    # Remove any Misión 7 specific content if exists
    # (Based on the roadmap, there was no card for 07, but let's check for "Misi\xc3\xb3n 7")
    # If I find a block for Misión 7, I should remove it.
    
    with open(filepath, 'wb') as f:
        f.write(content)

filepath = 'c:/Users/USUARIO/Desktop/RA/rainclass/src/app/pages/laboratories/lab-inicio/lab-inicio.component.html'
fix_file(filepath)
print("Finished fixing lab-inicio.component.html")
