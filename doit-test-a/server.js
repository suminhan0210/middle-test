const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3519;

app.use(express.urlencoded({ extended: true }));
// POST /todo/1?_method=PUT → PUT /todo/1 로 처리
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 저장 (서버 재시작 시 초기화)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

app.get('/todo', (req, res) => {
  res.json(todos);
});

app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) todos.push({ id: nextId++, text });
  res.redirect('/');
});

app.put('/todo/:id', (req, res) => {
  const todoId = parseInt(req.params.id, 10); // URL 파라미터에서 수정할 ID 추출
  const newText = (req.body.text || '').trim(); // 수정할 텍스트 추출

  // 배열에서 해당 ID를 가진 할 일 찾기
  const todo = todos.find(t => t.id === todoId);

  if (todo && newText) {
    todo.text = newText; // 기존 텍스트를 새 텍스트로 업데이트 (교체)
  }

  res.redirect('/'); // 수정 완료 후 메인 페이지로 리다이렉트
});

app.delete('/todo/:id', (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  todos = todos.filter(todo => todo.id !== todoId);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
