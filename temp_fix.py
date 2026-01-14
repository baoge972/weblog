import re
file_path = r'd:\\记事本\\weblog\\weblog-main\\themes\\solitude\\source\\js\\main .js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并修复被破坏的正则表达式行 - 它应该是类似这样的一行被破坏了：
# el.value = >  + txt.replace(
# /g, 
# > ) + 
# 
# ;

# 将被破坏的多行替换为正确的单行
lines = content.split('\n')
for i in range(len(lines)):
    if 'txt.replace(' in lines[i] and '/g,' in lines[i+1] if i+1 < len(lines) else False:
        # 找到了被破坏的行，将其修复为正确格式
        if '/g,' in lines[i+1]:
            if '> ) + ' in lines[i+2]:
 # 修复这3-4行的代码
 lines[i] = ' el.value = >  + txt.replace(/\n/g, \n> ) + \n\n;'
 lines[i+1] = lines[i+2] = lines[i+3] = '' # 清空接下来的几行

# 重新组合内容，跳过空行
result_lines = []
i = 0
while i < len(lines):
 if lines[i] == '':
 # 跳过连续的空行
 while i < len(lines) and lines[i] == '':
 i += 1
 continue
 result_lines.append(lines[i])
 i += 1

content = '\n'.join(result_lines)

# 修复乱码注释
content = content.replace('// 鍒囨崲鑿滃崟鐘舵侊紝鑰屼笉鏄鏄ユ绘槸鎵撳紑', '// 切换菜单状态，而不是总是打开')
content = content.replace('// 鍦ㄧЩ鍔ㄧ鑿滃崟鎵撳紑鍚庯紝纭繚瀛愯彍鍗曢」鍙俊', '// 在移动端菜单打开后，确保子菜单项可见')

with open(file_path, 'w', encoding='utf-8') as f:
 f.write(content)

print('修复完成')
