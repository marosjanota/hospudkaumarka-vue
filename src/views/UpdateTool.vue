<template>
  <Section>
    <Box title="Jedálny lístok (.docx → JSON)">
      <label>
        Týždeň od:
        <input type="date" v-model="mondayDate" />
      </label>

      <div class="mt-md">
        <input type="file" accept=".doc,.docx" @change="handleFileChange" />

        <button :disabled="!file || loading" @click="handleUpload">
          {{ loading ? 'Spracovávam…' : 'Vygeneruj JSON' }}
        </button>
      </div>

      <div v-if="jsonResult">
        <h2>Výsledok</h2>
        <pre>{{ jsonResult }}</pre>
        <button @click="handleGitHubUpload">💾 Uložiť na GitHub</button>
      </div>
    </Box>
  </Section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as mammoth from 'mammoth';

import { Section, Box } from "@/components";

const file = ref<File | null>(null);
const jsonResult = ref('');
const loading = ref(false);
const mondayDate = ref(getNextMonday());

function getNextMonday(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = (8 - day) % 7 || 7;
  today.setDate(today.getDate() + diff);
  return today.toISOString().split('T')[0];
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
}

async function handleUpload() {
  if (!file.value) return;
  loading.value = true;

  const arrayBuffer = await file.value.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const parsed = parseMenuLines(lines, mondayDate.value);

  jsonResult.value = JSON.stringify(parsed, null, 2);
  loading.value = false;
}

async function handleGitHubUpload() {
  if (!jsonResult.value) return;

  const token = prompt('Zadaj svoj GitHub Personal Access Token:');
  if (!token) return;

  const repoOwner = 'marosjanota';
  const repoName = 'hospudkaumarka-vue';
  const filePath = 'json/menu.json';
  const branch = 'gh-pages';
  const commitMessage = `Aktualizace jídelního lístku k ${mondayDate.value}`;
  const contentEncoded = btoa(unescape(encodeURIComponent(jsonResult.value)));

  const existing = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  let sha: string | undefined = undefined;

  if (existing.status === 200) {
    const data = await existing.json();
    sha = data.sha;
  } else if (existing.status === 404) {
    // súbor neexistuje → sha ostáva undefined
    console.log('ℹ️ Súbor neexistuje, bude vytvorený');
  } else {
    const err = await existing.json();
    console.error('❌ Chyba pri zisťovaní existujúceho súboru:', err);
    alert('❌ Chyba pri zisťovaní súboru na GitHube');
    return;
  }

  const upload = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: commitMessage,
      content: contentEncoded,
      sha: sha || undefined,
      branch: branch
    })
  });

  if (upload.ok) {
  alert('✅ Nahrané na GitHub!');
  } else {
    const error = await upload.json();
    console.error('❌ GitHub error:', error);
    alert(`❌ Chyba pri nahrávaní: ${error.message || 'neznáma chyba'}`);
  }

}

function parseMenuLines(lines: string[], mondayDate: string) {
  const dayNames = ['Pondělí', 'Ůterý', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'];
  const dailyMenu: any[] = [];
  let i = 0;
  let id = 1;
  let weeklySpecial = '';

  while (i < lines.length) {
    const day = lines[i];
    if (!dayNames.includes(day)) {
      i++;
      continue;
    }

    const normalizedDay = day === 'Ůterý' ? 'Úterý' : day;
    i++;

    let open = true;
    let meal01 = '';
    let meal02 = '';
    let meal03 = '';
    let closedText = '';

    const nextLines = lines.slice(i, i + 5);
    const closedLine = nextLines.find(l => l.toLowerCase().includes('zavřeno'));
    if (closedLine) {
      open = false;
      closedText = closedLine;
      i += nextLines.indexOf(closedLine) + 1;
    } else {
      if (/^0[,\.\-]?3l$/i.test(lines[i])) {
        i++;
        meal01 = lines[i] || '';
        i += 2;
      }

      const meals: string[] = [];
      while (i < lines.length && meals.length < 4) {
        if (/^[1-4]\.$/.test(lines[i])) {
          const dish = lines[i + 1];
          if (dish && !/^[\d,\.\-]+$/.test(dish)) {
            meals.push(dish);
          }
          i += 3;
        } else {
          i++;
        }
      }

      meal02 = meals[0] || '';
      meal03 = meals[1] || '';

      if (!weeklySpecial && meals[2]) {
        weeklySpecial = meals[2];
      }
    }

    dailyMenu.push({
      id: id++,
      day: normalizedDay,
      open,
      meal01,
      meal02,
      meal03,
      closedText
    });
  }

  return {
    dailyRepeat: {
      meal04: `Jídlo týdne - ${weeklySpecial}`,
      meal05: 'Salát Caesar s kuřecím masem, krutony a sýrem',
      mondayDate
    },
    dailyMenu
  };
};
</script>


<style scoped>
pre {
  background: #f4f4f4;
  padding: 10px;
  white-space: pre-wrap;
}
</style>