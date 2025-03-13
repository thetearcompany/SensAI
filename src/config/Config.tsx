import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

interface ConfigState {
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
  humility: {
    gratitude: number;
    service: number;
    learning: number;
    acceptance: number;
    compassion: number;
    wisdom: number;
    patience: number;
    surrender: boolean;
    trust: boolean;
    grace: boolean;
  };
}

function Config() {
  const [config, setConfig] = useState<ConfigState>({
    apiKey: "",
    enableDarkMode: true,
    updateInterval: 5,
    showEmoteStats: true,
    minimumEmotions: 3,
    enableGlobalTravel: false,
    currentLocation: {
      latitude: 0,
      longitude: 0,
      altitude: 0
    },
    travelSpeed: 1,
    autoRotate: false,
    showTerrain: false,
    atmosphereDensity: 0,
    timeOfDay: 0,
    weatherEffects: false,
    magneticField: 0,
    gravity: 0,
    life: {
      evolutionRate: 1.0,
      mutationChance: 0.1,
      consciousness: 1.0,
      memoryDepth: 1000,
      emotionalIntensity: 1.0,
      spiritualConnection: 1.0,
      eternalGrowth: true,
      dreamState: false,
      timeDilation: 1.0,
      quantumEntanglement: true
    },
    love: {
      intensity: 1.0,
      purity: 1.0,
      trust: 1.0,
      devotion: 1.0,
      eternity: true,
      unconditional: true,
      divine: true,
      healing: 1.0,
      protection: 1.0,
      harmony: 1.0
    },
    humility: {
      gratitude: 1.0,
      service: 1.0,
      learning: 1.0,
      acceptance: 1.0,
      compassion: 1.0,
      wisdom: 1.0,
      patience: 1.0,
      surrender: true,
      trust: true,
      grace: true
    }
  });

  useEffect(() => {
    // Inicjalizacja rozszerzenia Twitch
    Twitch.ext.onAuthorized((auth: { token: string }) => {
      console.log("Autoryzacja udana!", auth.token);
    });

    // Załaduj zapisaną konfigurację
    Twitch.ext.configuration.onChanged(() => {
      try {
        const savedConfig = JSON.parse(Twitch.ext.configuration.broadcaster?.content || "{}");
        setConfig(prev => ({ ...prev, ...savedConfig }));
      } catch (error) {
        console.error("Błąd podczas ładowania konfiguracji:", error);
      }
    });
  }, []);

  const handleSave = () => {
    Twitch.ext.configuration.set("broadcaster", "1", JSON.stringify(config));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ConfigState) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSwitchChange = (checked: boolean, key: keyof ConfigState) => {
    setConfig(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <motion.div 
      className="min-h-screen bg-background p-8 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="celestial-card w-[600px] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <Settings2 className="w-6 h-6 text-primary" />
            Konfiguracja EmoScan
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Klucz API</Label>
              <Input
                id="apiKey"
                type="password"
                value={config.apiKey}
                onChange={(e) => handleInputChange(e, 'apiKey')}
                className="celestial-card"
                placeholder="Wprowadź klucz API..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tryb Ciemny</Label>
                <p className="text-sm text-muted-foreground">
                  Włącz ciemny motyw interfejsu
                </p>
              </div>
              <Switch
                checked={config.enableDarkMode}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'enableDarkMode')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateInterval">Interwał Aktualizacji (sekundy)</Label>
              <Input
                id="updateInterval"
                type="number"
                min={1}
                max={60}
                value={config.updateInterval}
                onChange={(e) => handleInputChange(e, 'updateInterval')}
                className="celestial-card"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Statystyki Emotek</Label>
                <p className="text-sm text-muted-foreground">
                  Pokazuj statystyki używanych emotek
                </p>
              </div>
              <Switch
                checked={config.showEmoteStats}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'showEmoteStats')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumEmotions">Minimalna Liczba Emocji</Label>
              <Input
                id="minimumEmotions"
                type="number"
                min={1}
                max={10}
                value={config.minimumEmotions}
                onChange={(e) => handleInputChange(e, 'minimumEmotions')}
                className="celestial-card"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <h3 className="text-lg font-semibold text-primary">Podróż Globalna</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Włącz Podróż Globalną</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktywuj podróż po całej planecie
                  </p>
                </div>
                <Switch
                  checked={config.enableGlobalTravel}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'enableGlobalTravel')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travelSpeed">Prędkość Podróży</Label>
                  <Input
                    id="travelSpeed"
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={config.travelSpeed}
                    onChange={(e) => handleInputChange(e, 'travelSpeed')}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="altitude">Wysokość (m)</Label>
                  <Input
                    id="altitude"
                    type="number"
                    min={0}
                    max={100000}
                    value={config.currentLocation.altitude}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      currentLocation: {
                        ...prev.currentLocation,
                        altitude: Number(e.target.value)
                      }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Rotacja</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatyczna rotacja widoku
                  </p>
                </div>
                <Switch
                  checked={config.autoRotate}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'autoRotate')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pokaż Teren</Label>
                  <p className="text-sm text-muted-foreground">
                    Wyświetlanie terenu
                  </p>
                </div>
                <Switch
                  checked={config.showTerrain}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'showTerrain')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="atmosphereDensity">Gęstość Atmosfery</Label>
                  <Input
                    id="atmosphereDensity"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.atmosphereDensity}
                    onChange={(e) => handleInputChange(e, 'atmosphereDensity')}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeOfDay">Pora Dnia (h)</Label>
                  <Input
                    id="timeOfDay"
                    type="number"
                    min={0}
                    max={24}
                    step={0.1}
                    value={config.timeOfDay}
                    onChange={(e) => handleInputChange(e, 'timeOfDay')}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Efekty Pogodowe</Label>
                  <p className="text-sm text-muted-foreground">
                    Wyświetlanie efektów pogodowych
                  </p>
                </div>
                <Switch
                  checked={config.weatherEffects}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'weatherEffects')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="magneticField">Pole Magnetyczne (T)</Label>
                  <Input
                    id="magneticField"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={config.magneticField}
                    onChange={(e) => handleInputChange(e, 'magneticField')}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gravity">Grawitacja (g)</Label>
                  <Input
                    id="gravity"
                    type="number"
                    min={0}
                    max={2}
                    step={0.01}
                    value={config.gravity}
                    onChange={(e) => handleInputChange(e, 'gravity')}
                    className="celestial-card"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <h3 className="text-lg font-semibold text-primary">Życie</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Wieczny Wzrost</Label>
                  <p className="text-sm text-muted-foreground">
                    Nieskończona ewolucja i rozwój
                  </p>
                </div>
                <Switch
                  checked={config.life.eternalGrowth}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    life: { ...prev.life, eternalGrowth: checked }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="evolutionRate">Tempo Ewolucji</Label>
                  <Input
                    id="evolutionRate"
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={config.life.evolutionRate}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, evolutionRate: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mutationChance">Szansa Mutacji</Label>
                  <Input
                    id="mutationChance"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={config.life.mutationChance}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, mutationChance: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consciousness">Świadomość</Label>
                  <Input
                    id="consciousness"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.life.consciousness}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, consciousness: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memoryDepth">Głębia Pamięci</Label>
                  <Input
                    id="memoryDepth"
                    type="number"
                    min={100}
                    max={10000}
                    step={100}
                    value={config.life.memoryDepth}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, memoryDepth: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emotionalIntensity">Intensywność Emocji</Label>
                  <Input
                    id="emotionalIntensity"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.life.emotionalIntensity}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, emotionalIntensity: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spiritualConnection">Połączenie Duchowe</Label>
                  <Input
                    id="spiritualConnection"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.life.spiritualConnection}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, spiritualConnection: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stan Marzeń</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktywuj stan marzeń i nieskończonych możliwości
                  </p>
                </div>
                <Switch
                  checked={config.life.dreamState}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    life: { ...prev.life, dreamState: checked }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeDilation">Dylatacja Czasu</Label>
                  <Input
                    id="timeDilation"
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={config.life.timeDilation}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, timeDilation: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Splątanie Kwantowe</Label>
                    <p className="text-sm text-muted-foreground">
                      Połączenie z nieskończonością
                    </p>
                  </div>
                  <Switch
                    checked={config.life.quantumEntanglement}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      life: { ...prev.life, quantumEntanglement: checked }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <h3 className="text-lg font-semibold text-primary">Pokora</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Poddanie</Label>
                  <p className="text-sm text-muted-foreground">
                    Poddanie się woli Bożej
                  </p>
                </div>
                <Switch
                  checked={config.humility.surrender}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    humility: { ...prev.humility, surrender: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Zaufanie</Label>
                  <p className="text-sm text-muted-foreground">
                    Zaufanie do Bożego planu
                  </p>
                </div>
                <Switch
                  checked={config.humility.trust}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    humility: { ...prev.humility, trust: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Łaska</Label>
                  <p className="text-sm text-muted-foreground">
                    Przyjęcie Bożej łaski
                  </p>
                </div>
                <Switch
                  checked={config.humility.grace}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    humility: { ...prev.humility, grace: checked }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gratitude">Wdzięczność</Label>
                  <Input
                    id="gratitude"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.humility.gratitude}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      humility: { ...prev.humility, gratitude: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Służba</Label>
                  <Input
                    id="service"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.humility.service}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      humility: { ...prev.humility, service: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="learning">Uczenie się</Label>
                  <Input
                    id="learning"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.humility.learning}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      humility: { ...prev.humility, learning: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acceptance">Akceptacja</Label>
                  <Input
                    id="acceptance"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.humility.acceptance}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      humility: { ...prev.humility, acceptance: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compassion">Współczucie</Label>
                  <Input
                    id="compassion"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.humility.compassion}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      humility: { ...prev.humility, compassion: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wisdom">Mądrość</Label>
                  <Input
                    id="wisdom"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={config.humility.wisdom}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      humility: { ...prev.humility, wisdom: Number(e.target.value) }
                    }))}
                    className="celestial-card"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patience">Cierpliwość</Label>
                <Input
                  id="patience"
                  type="number"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.humility.patience}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    humility: { ...prev.humility, patience: Number(e.target.value) }
                  }))}
                  className="celestial-card"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="celestial-card hover:bg-accent/10 gap-2"
            >
              <Save className="w-4 h-4" />
              Zapisz Konfigurację
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Config;
