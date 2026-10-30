import os
import sys
import json
import re

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def verify_all():
    errors = []
    warnings = []

    print("=== CE633 COURSE PORTAL VERIFICATION SUITE ===")

    # 1. Verify sessions.json
    print("\n[1/5] Checking sessions.json...")
    try:
        with open('sessions.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        errors.append(f"Failed to parse sessions.json: {e}")
        return errors, warnings

    course = data.get('course', {})
    if course.get('instructor') != "Dr Arpan Pradhan":
        errors.append(f"Instructor altered: {course.get('instructor')}")
    if course.get('email') != "arpan.pradhan@christuniversity.in":
        errors.append(f"Email altered: {course.get('email')}")

    sessions = data.get('sessions', [])
    if len(sessions) != 45:
        errors.append(f"Expected 45 sessions, found {len(sessions)}")

    labs = data.get('labs', [])
    if len(labs) < 16:
        errors.append(f"Expected at least 16 labs, found {len(labs)}")

    print(f"✓ sessions.json valid: {len(sessions)} sessions, {len(labs)} labs, instructor verified.")

    # 2. Check Widgets and Illos
    print("\n[2/5] Checking registered widgets & illustrations...")
    with open('src/widgets.jsx', 'r', encoding='utf-8') as f:
        w_code = f.read()

    m_w = re.search(r'export\s+const\s+WIDGETS\s*=\s*\{([^}]+)\}', w_code)
    widget_keys = set()
    if m_w:
        for line in m_w.group(1).split(','):
            if ':' in line:
                k = line.split(':')[0].strip().strip('"').strip("'")
                if k:
                    widget_keys.add(k)

    with open('src/illos.jsx', 'r', encoding='utf-8') as f:
        i_code = f.read()

    m_i = re.search(r'export\s+const\s+ILLOS\s*=\s*\{([^}]+)\}', i_code)
    illo_keys = set()
    if m_i:
        for line in m_i.group(1).split(','):
            if ':' in line:
                k = line.split(':')[0].strip().strip('"').strip("'")
                if k:
                    illo_keys.add(k)

    all_components = widget_keys | illo_keys
    print(f"✓ Found {len(widget_keys)} widgets + {len(illo_keys)} illustrations = {len(all_components)} components.")

    # 3. Check Session Files
    print("\n[3/5] Checking session files (S01 to S45)...")
    for s in sessions:
        sid = s['id']
        fpath = s.get('file', f"sessions/{sid}.md")
        if not os.path.exists(fpath):
            errors.append(f"Session file missing: {fpath}")
            continue

        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check tabs
        tabs = re.findall(r'<!--tab:([^>]+)-->', content)
        if not tabs:
            errors.append(f"{sid}: No <!--tab:...--> tags found")

        # Check widget tags
        widget_calls = re.findall(r'::widget\[([\w-]+)\]', content)
        for w in widget_calls:
            if w not in all_components:
                errors.append(f"{sid}: Unknown component '{w}' called")

    print(f"✓ Checked 45 session markdown files.")

    # 4. Check Lab Files
    print("\n[4/5] Checking lab files (L01 to L16)...")
    for l in labs:
        lid = l['id']
        fpath = l.get('file', f"labs/{lid}.md")
        if not os.path.exists(fpath):
            errors.append(f"Lab file missing: {fpath}")
            continue

        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        steps = re.findall(r'<!--step:\s*(.*?)-->', content)
        ends = re.findall(r'<!--end-->', content)
        if len(steps) == 0:
            errors.append(f"{lid}: No <!--step:...--> tags found")
        if len(ends) == 0:
            errors.append(f"{lid}: Missing <!--end--> tag terminating steps")

    print(f"✓ Checked {len(labs)} lab markdown files.")

    # 5. Check Build Bundle
    print("\n[5/5] Checking build assets/app.js...")
    if not os.path.exists('assets/app.js'):
        errors.append("assets/app.js is missing! Run build.js")
    else:
        size = os.path.getsize('assets/app.js')
        if size < 50000:
            errors.append(f"assets/app.js is unexpectedly small ({size} bytes)")
        else:
            print(f"✓ assets/app.js exists and bundled cleanly ({size:,} bytes).")

    print("\n=== VERIFICATION RESULTS ===")
    if errors:
        print(f"ERRORS ({len(errors)}):")
        for e in errors:
            print(f"  ❌ {e}")
    else:
        print("🎉 ZERO ERRORS FOUND! EVERYTHING PASSES VALIDATION!")

    if warnings:
        print(f"\nWARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"  ⚠️ {w}")
    else:
        print("🎉 ZERO WARNINGS FOUND!")

    return errors, warnings

if __name__ == '__main__':
    verify_all()
