import os
import urllib.request

# Create textures directory
os.makedirs("solar-odyssey-app/public/textures", exist_ok=True)

textures = {
    "sun.jpg": "https://www.solarsystemscope.com/textures/download/2k_sun.jpg",
    "mercury.jpg": "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
    "venus.jpg": "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
    "earth.jpg": "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
    "mars.jpg": "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
    "jupiter.jpg": "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
    "saturn.jpg": "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
    "saturn_ring.png": "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
    "uranus.jpg": "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
    "neptune.jpg": "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
    "moon.jpg": "https://www.solarsystemscope.com/textures/download/2k_moon.jpg",
    "earth_clouds.jpg": "https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg",
    "earth_night.jpg": "https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg"
}

for filename, url in textures.items():
    filepath = os.path.join("solar-odyssey-app/public/textures", filename)
    if not os.path.exists(filepath):
        print(f"Downloading {filename}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Success: {filename}")
        except Exception as e:
            print(f"Failed to download {filename}: {e}")
    else:
        print(f"Already exists: {filename}")
