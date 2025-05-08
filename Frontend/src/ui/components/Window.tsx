import { useState } from "react";

const Window = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const code = `class SatyamJha:
    def __init__(self):
        self.name = "Satyam Kumar Jha"
        self.role = "Python/Full-Stack/ Developer and ML Engineer"
        self.skills = ["Python", "Flask", "Express", "React", "Scikit-learn", "Keras", "Sreamlit"]
        self.education = ["B.Tech from Maharaja Agrasen Institute of Technology(GGSIPU)"]
    
    def say_hello(self):
        return "Hello! I'm Satyam Kumar Jha, Thank you visiting my Porfolio."
    
    def get_contact(self):
        return {"email": "satyamjha4@gmail.com", "phone": "+91 7683095499", "github": "Satyamkumarjha4", "linkedin": "satyamkumarjha4"}
        
    # Initialize
    satyam = SatyamJha()
    print(satyam.say_hello())`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (

      <div className="w-full max-w-3xl rounded-lg overflow-hidden border border-gray-700 shadow-xl bg-gray-900">
        {/* Header with window controls */}
        <div className="bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 flex items-center text-xs text-gray-400">
            <span>python-dev.py</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="ml-auto text-gray-400 hover:text-white transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <span className="text-green-400">✓</span>
            ) : (
              <span>📋</span>
            )}
          </button>
        </div>

        {/* Code content */}
        <div className="bg-gray-900 p-6 font-mono text-sm overflow-auto">
          <pre className="text-gray-300">
            <span className="text-purple-400">class </span>
            <span className="text-yellow-300">SatyamJha</span>
            <span className="text-blue-300">:</span>
            <br />
            {"    "}
            <span className="text-purple-400">def </span>
            <span className="text-blue-300">__init__</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">):</span>
            <br />
            {"        "}
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">.</span>
            <span className="text-blue-300">name</span>
            <span className="text-gray-300"> = </span>
            <span className="text-green-400">"Satyam Kumar Jha"</span>
            <br />
            {"        "}
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">.</span>
            <span className="text-blue-300">role</span>
            <span className="text-gray-300"> = </span>
            <span className="text-green-400">"Python/Full-Stack Developer and ML Engineer"</span>
            <br />
            {"        "}
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">.</span>
            <span className="text-blue-300">skills</span>
            <span className="text-gray-300"> = [</span>
            <span className="text-green-400">"Python"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"Flask"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"Express"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"React"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"Scikit-learn"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"Keras"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"Streamlit"</span>
            <span className="text-gray-300">]</span>
            <br />
            {"        "}
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">.</span>
            <span className="text-blue-300">education</span>
            <span className="text-gray-300"> = [</span>
            <span className="text-green-400">"B.Tech from Maharaja Agrasen Institute of Technology(GGSIPU)"</span>
            <span className="text-gray-300">]</span>
            <br />
            {"    "}
            <br />
            {"    "}
            <span className="text-purple-400">def </span>
            <span className="text-yellow-300">say_hello</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">):</span>
            <br />
            {"        "}
            <span className="text-purple-400">return </span>
            <span className="text-green-400">"Hello! I'm Satyam, Thank you for visiting my Porfolio."</span>
            <br />
            {"    "}
            <br />
            {"    "}
            <span className="text-purple-400">def </span>
            <span className="text-yellow-300">get_contact</span>
            <span className="text-gray-300">(</span>
            <span className="text-orange-300">self</span>
            <span className="text-gray-300">):</span>
            <br />
            {"        "}
            <span className="text-purple-400">return </span>
            <span className="text-gray-300">{"{"}</span>
            <span className="text-green-400">"email"</span>
            <span className="text-gray-300">: </span>
            <span className="text-green-400">"satyamjha4@gmail.com"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"phone"</span>
            <span className="text-gray-300">: </span>
            <span className="text-green-400">"+91 7683095499"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"github"</span>
            <span className="text-gray-300">: </span>
            <span className="text-green-400">"Satyamkumarjha4"</span>
            <span className="text-gray-300">, </span>
            <span className="text-green-400">"linkedin"</span>
            <span className="text-gray-300">: </span>
            <span className="text-green-400">"satyamkumarjha4"</span>
            <span className="text-gray-300">{"}"}</span>
            <br />
            <br />
            <span className="text-gray-400"># Initialize</span>
            <br />
            <span className="text-blue-300">satyam</span>
            <span className="text-gray-300"> = </span>
            <span className="text-yellow-300">SatyamJha</span>
            <span className="text-gray-300">()</span>
            <br />
            <span className="text-pink-400">print</span>
            <span className="text-gray-300">(satyam.</span>
            <span className="text-yellow-300">say_hello</span>
            <span className="text-gray-300">())</span>
          </pre>
        </div>

        {/* Terminal output */}
        <div className="bg-black p-4 border-t border-gray-700">
          <div className="flex items-center text-gray-400 mb-2">
            <span className="text-xs">Output:</span>
          </div>
          <div className="text-green-400 font-mono text-sm">
            {">"} Hello! I'm Satyam, Thank you for visiting my Porfolio.
          </div>
        </div>
      </div>

  );
};

export default Window;