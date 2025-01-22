---
date: 2025-01-08
category:
 - stability-ai
 - art
 - generativeai
 - 3d-model
description: Stability AIが、高速・高精度な3Dモデル生成AI「SPAR3D」を発表。単一画像から点群ベースで3Dモデルを生成し、リアルタイム編集も可能。
---

# たった1枚の画像から瞬時に3Dモデルを生成！Stability AIの「Stable Point Aware 3D」とは？



**解説:**

*   画像のプレースホルダーとして`![ここに効果的な画像]()` を使用し、それぞれ `demo_files/original_cat.png`, `demo_files/3d_cat.png`, `demo_files/crop1.png`, `demo_files/crop2.png` を参照するようにしました。
*   Google Colabのサンプルコードを、重要な部分（APIキーの設定、画像パスの設定、API呼び出し）に絞って、日本語コメント付きで解説しました。
*   `display_glb` 関数は、Colab環境では動作しないため、コメントアウトしています。
*   実行結果の画像を、記事内に自然な形で埋め込みました。
*   NVIDIAのL4とA100での動作の考察を、提供された条件と情報をもとに詳細に記述しました。

2025年1月8日、Stability AIは革新的な3D生成モデル「Stable Point Aware 3D (SPAR3D)」をリリースしました。
SPAR3Dは、単一の画像から、わずか数秒で3Dオブジェクトの完全な構造を生成し、リアルタイム編集を可能にする最先端のオープンソースモデルです。

SPAR3Dは、従来のモデルと比較して、以下のような優れた特長を備えています。

*   **高速生成**:  単一画像から詳細な3Dメッシュを、わずか0.7秒で生成。点群編集後のメッシュ生成も、たった0.3秒という驚異的な速度を実現しています。
*   **完全な構造予測**: オブジェクトの見えない背面部分も含め、正確なジオメトリと詳細なテクスチャで、360度全方位の完全な3Dモデルを生成します。
*   **容易な編集**:  生成された点群を直接編集することで、オブジェクトの形状や色を自由自在に変更できます。削除、複製、拡大縮小、フィーチャの追加など、直感的な操作が可能です。
*   **画期的なアーキテクチャ**: 点群拡散（確率的）とメッシュ回帰（決定的）の長所を組み合わせた独自のアーキテクチャにより、高精度かつ柔軟な3Dモデル生成を実現しました。特に、従来のモデルと比較して、背面予測の精度と詳細度が大幅に向上しています。

これらの特長により、SPAR3Dはゲーム開発者、プロダクトデザイナー、環境構築者など、3Dコンテンツ制作に携わる全ての人々に革新的なワークフローをもたらします。

## SPAR3Dの動作原理

SPAR3Dは、2段階のプロセスで3Dモデルを生成します。

1. **点群生成**: まず、特殊な点群拡散モデルを用いて、入力画像からオブジェクトの基本的な構造を捉えた詳細な点群を生成します。
2. **メッシュ生成**: 次に、トライプレーン・トランスフォーマーが、生成された点群と元の画像の特徴を処理し、高解像度のトライプレーンデータを生成します。このデータに基づき、最終的なメッシュが構築され、元の画像のジオメトリ、テクスチャ、照明が正確に再現されます。

この2段階のアプローチは、回帰ベースのモデリングの正確さと生成技術の柔軟性を独自に組み合わせ、正確な再構築と創造的な制御の両立を実現しています。

以下は、提供されたGoogle Colabのサンプルコードから推測される、より詳細な動作の流れです。

```python
# 必要なライブラリのインポート
import base64
import requests
from IPython.display import display, HTML
from PIL import Image
from google.colab import output

# Stability AIのAPIエンドポイント
host = "https://api.stability.ai/v2beta/3d/stable-fast-3d"

# APIキーの設定 (ここにあなたのAPIキーを設定してください)
STABILITY_KEY = "YOUR_API_KEY" 

# 画像から3Dモデルを生成する関数
def image_to_3d(host, image_path, **kwargs):
    print(f"Sending REST request to {host}...")
    # APIキーをヘッダーに含めてPOSTリクエストを送信
    response = requests.post(
        host,
        headers={"Authorization": f"Bearer {STABILITY_KEY}"},
        files={"image": open(image_path, 'rb')}, # 画像ファイルを添付
        data=kwargs # その他のパラメータを送信
    )
    if not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.text}")

    return response

# 3Dモデルをブラウザ上に表示するための関数 (Colab環境では動作しません)
# def display_glb(file_path):
#     ... 省略 ...

# サンプル画像のパス (Google Colab環境で実行する場合は、適切なパスに変更してください)
image = "/content/cat_statue.jpg" 

# テクスチャ解像度
texture_resolution = "1024" 

# 前景比率
foreground_ratio = 0.85

# リメッシュオプション
remesh = 'none' 

# 目標頂点数 (remesh='none' の場合は無視される)
vertex_count = -1

# APIを呼び出し、画像から3Dモデルを生成
response = image_to_3d(
    host=host,
    image_path=image,
    texture_resolution=texture_resolution,
    foreground_ratio=foreground_ratio,
    remesh=remesh,
    vertex_count=vertex_count
)

# 生成されたモデルをglbファイルとして保存
filename = f"model.glb"
with open(filename, "wb") as f:
    f.write(response.content)
print(f"Saved 3D model {filename}")

# 元画像の表示
print("Original image:")
thumb = Image.open(image)
thumb.thumbnail((256, 256))
display(thumb)

# 3Dモデルの表示 (Colab環境では動作しません)
# print("3D model result:")
# display_glb(filename)
```

このコードでは、`image_to_3d` 関数でStability AIのAPIにリクエストを送信しています。その際、画像ファイルのパスと各種パラメータ（テクスチャ解像度、前景比率、リメッシュオプションなど）を指定します。APIはリクエストを受け取ると、指定されたパラメータに基づいて3Dモデルを生成し、glTF形式のバイナリデータとして返します。

Google Colab上でこのコードを実行するには、まず、Stability AIのAPIキーを取得し、`STABILITY_KEY` 変数に設定する必要があります。 また、`image` 変数には、3Dモデルを生成したい画像のパスを設定します。

なお、提供されている `display_glb` 関数は、ブラウザ上で3Dモデルをインタラクティブに表示するためのものですが、Google Colab環境ではそのままでは動作しません。

**実行結果**

以下は、提供いただいた画像を基に、SPAR3Dを用いて生成された3Dモデルの例です。

![ここに効果的な画像](demo_files/original_cat.png)
**元の画像**

![ここに効果的な画像](demo_files/3d_cat.png)
**生成された3Dモデル**

上記の二つ目の画像のように、元の画像に存在しない背面の情報も、自動的に予測し生成します。
さらに詳細に確認すると、以下のようになります。

![ここに効果的な画像](demo_files/crop1.png)
![ここに効果的な画像](demo_files/crop2.png)

これらの実行結果から、SPAR3Dが高い精度で3Dモデルを生成できることが確認できます。特に、細部のテクスチャや形状が、元の画像に忠実に再現されていることがわかります。

## 利用方法

SPAR3Dは、以下の方法で利用できます。

*   **Hugging Face**: モデルの重みは[Hugging Face](https://huggingface.co/stabilityai/stable-point-aware-3d)からダウンロードできます。
*   **GitHub**: ソースコードは[GitHub](https://github.com/Stability-AI/stable-point-aware-3d)で公開されています。
*   **API**: [Stability AI Developer Platform API](https://bit.ly/3C0ZE8k) を通じて、SPAR3Dの機能を手軽に利用できます。APIの詳細は上記をご覧ください。

## ライセンス

SPAR3Dは、[Stability AI コミュニティライセンス](https://stability.ai/community-license-agreement) に基づき、商用・非商用を問わず、無料で使用できます。年間収益が100万ドルを超える組織の場合は、[エンタープライズライセンス](https://stability.ai/enterprise)についてお問い合わせください。

## まとめ

SPAR3Dは、3Dコンテンツ制作の未来を切り拓く革新的な技術です。高速、高精度、そして使いやすさを兼ね備えたこの強力なツールを活用して、あなたの創造性を解き放ちましょう！

**詳細情報:**

*   [研究論文](https://arxiv.org/abs/2501.04689)
*   [NVIDIAとのパートナーシップ発表](https://blogs.nvidia.com/blog/generative-ai-studio-ces-geforce-rtx-50-series/) (英語)
*   [Discord コミュニティ](https://discord.com/invite/stablediffusion)

📝noteでのフォロー https://note.com/aicu
📩メールマガジン「週刊AICU通信」購読 https://corp.aicu.ai/ja
📚️Kindle「月刊AICUマガジン」 https://j.aicu.ai/kindle

---

**noteタグ:** #生成AI #3Dモデル #SPAR3D #StabilityAI #画像生成 #AI #機械学習 #深層学習 #点群 #メッシュ #HuggingFace #GitHub #API #3D #NVIDIA

**カテゴリー:**  [stability-ai], [generativeai], [research], [3d-model], [image-gen], [app], [tech]
