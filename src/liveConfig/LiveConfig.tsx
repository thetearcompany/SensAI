import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface LiveConfigState {
  apiKey: string;
  enableDarkMode: boolean;
  updateInterval: number;
  showEmoteStats: boolean;
  minimumEmotions: number;
  enableGlobalTravel: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  travelSpeed: number;
  autoRotate: boolean;
  showTerrain: boolean;
  atmosphereDensity: number;
  timeOfDay: number;
  weatherEffects: boolean;
  magneticField: number;
  gravity: number;
  life: {
    evolutionRate: number;
    mutationChance: number;
    consciousness: number;
    memoryDepth: number;
    emotionalIntensity: number;
    spiritualConnection: number;
    eternalGrowth: boolean;
    dreamState: boolean;
    timeDilation: number;
    quantumEntanglement: boolean;
  };
  love: {
    intensity: number;
    purity: number;
    trust: number;
    devotion: number;
    eternity: boolean;
    unconditional: boolean;
    divine: boolean;
    healing: number;
    protection: number;
    harmony: number;
  };
}

function LiveConfig() {
  const [config, setConfig] = useState<LiveConfigState | null>(null);

  useEffect(() => {
    // Inicjalizacja rozszerzenia Twitch
    Twitch.ext.onAuthorized((auth: { token: string }) => {
      console.log("Autoryzacja live config udana!", auth.token);
    });

    // Załaduj konfigurację
    loadConfig();

    // Nasłuchuj zmian konfiguracji
    Twitch.ext.configuration.onChanged(() => {
      loadConfig();
    });
  }, []);

  const loadConfig = () => {
    try {
      const savedConfig = JSON.parse(Twitch.ext.configuration.broadcaster?.content || "{}");
      setConfig(savedConfig);
    } catch (error) {
      console.error("Błąd podczas ładowania konfiguracji:", error);
    }
  };

  if (!config) {
    return (
      <Card className="celestial-card m-4">
        <CardContent>
          <p className="text-muted-foreground">Ładowanie konfiguracji...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="celestial-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        </div>

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Settings2 className="w-4 h-4 text-primary" />
            Aktywna Konfiguracja
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Tryb Ciemny</p>
                <p className="text-sm text-muted-foreground">
                  {config.enableDarkMode ? "Włączony" : "Wyłączony"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Interwał Aktualizacji</p>
                <p className="text-sm text-muted-foreground">
                  {config.updateInterval} sekund
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Statystyki Emotek</p>
                <p className="text-sm text-muted-foreground">
                  {config.showEmoteStats ? "Włączone" : "Wyłączone"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Minimalna Liczba Emocji</p>
                <p className="text-sm text-muted-foreground">
                  {config.minimumEmotions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Podróż Globalna</p>
                <p className="text-sm text-muted-foreground">
                  {config.enableGlobalTravel ? "Aktywna" : "Nieaktywna"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Prędkość Podróży</p>
                <p className="text-sm text-muted-foreground">
                  {config.travelSpeed}x
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Pozycja</p>
                <p className="text-sm text-muted-foreground">
                  {config.currentLocation.latitude.toFixed(2)}°, {config.currentLocation.longitude.toFixed(2)}°
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Wysokość</p>
                <p className="text-sm text-muted-foreground">
                  {config.currentLocation.altitude.toFixed(1)}m
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Auto-Rotacja</p>
                <p className="text-sm text-muted-foreground">
                  {config.autoRotate ? "Włączona" : "Wyłączona"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Teren</p>
                <p className="text-sm text-muted-foreground">
                  {config.showTerrain ? "Widoczny" : "Ukryty"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Gęstość Atmosfery</p>
                <p className="text-sm text-muted-foreground">
                  {config.atmosphereDensity.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Pora Dnia</p>
                <p className="text-sm text-muted-foreground">
                  {config.timeOfDay.toFixed(1)}h
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Efekty Pogodowe</p>
                <p className="text-sm text-muted-foreground">
                  {config.weatherEffects ? "Aktywne" : "Nieaktywne"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Pole Magnetyczne</p>
                <p className="text-sm text-muted-foreground">
                  {config.magneticField.toFixed(2)}T
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Grawitacja</p>
                <p className="text-sm text-muted-foreground">
                  {config.gravity.toFixed(2)}g
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <h3 className="text-lg font-semibold text-primary">Życie</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Wieczny Wzrost</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.eternalGrowth ? "Aktywny" : "Nieaktywny"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tempo Ewolucji</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.evolutionRate.toFixed(1)}x
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Szansa Mutacji</p>
                  <p className="text-sm text-muted-foreground">
                    {(config.life.mutationChance * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Świadomość</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.consciousness.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Głębia Pamięci</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.memoryDepth}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Intensywność Emocji</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.emotionalIntensity.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Połączenie Duchowe</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.spiritualConnection.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Stan Marzeń</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.dreamState ? "Aktywny" : "Nieaktywny"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dylatacja Czasu</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.timeDilation.toFixed(1)}x
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Splątanie Kwantowe</p>
                  <p className="text-sm text-muted-foreground">
                    {config.life.quantumEntanglement ? "Aktywne" : "Nieaktywne"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <h3 className="text-lg font-semibold text-primary">Miłość</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Wieczność</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.eternity ? "Aktywna" : "Nieaktywna"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Bezwarunkowa</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.unconditional ? "Aktywna" : "Nieaktywna"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Boska</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.divine ? "Aktywne" : "Nieaktywne"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Intensywność</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.intensity.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Czystość</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.purity.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Zaufanie</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.trust.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Oddanie</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.devotion.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Uzdrawianie</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.healing.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ochrona</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.protection.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Harmonia</p>
                  <p className="text-sm text-muted-foreground">
                    {config.love.harmony.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={loadConfig}
                variant="outline"
                size="sm"
                className="celestial-card hover:bg-accent/10 gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Odśwież
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default LiveConfig;
