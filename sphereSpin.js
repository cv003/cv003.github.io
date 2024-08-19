        const images = [];
        const frontImages = [];
        const numImages = 20;
        const radius = 200;
        const fov = 250;
        const sphereContainer = document.getElementById("sphere");
        const frontSphereContainer = document.getElementById("frontSphere");

        const zSimplicity = 25;

        for (let i = 0; i < numImages*2; i++) {
            const img = document.createElement('img');
            img.src = `silly.png`;
            img.className = 'image';

            if (i < numImages) {
                sphereContainer.appendChild(img);
                images.push(img);
            }
            else
            {
                frontSphereContainer.appendChild(img);
                frontImages.push(img);
            }
            
        }

        let easingAngleX = 0;
        let easingAngleY = 0;

        let angleX = 0;
        let angleY = 0;
        
        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        let start = 1;
        function animate(timeStamp) {
            
            const elapsed = timeStamp - start;
            start = timeStamp;

            let ease = Math.min(0.0025 * elapsed, 1)
            angleX = lerp(angleX, easingAngleX, ease);
            angleY = lerp(angleY, easingAngleY, ease);

            frontSphereContainer.style.zIndex = fov / zSimplicity;

            for (let rawi = 0; rawi < numImages*2; rawi ++) {
                let img = images[rawi];
                let i = rawi;
                let front = false;

                if (rawi >= numImages) {
                    i = i - numImages;
                    img = frontImages[i];
                    front = true
                }
                const phi = Math.acos(1 - 2 * (i + 0.5) / numImages);
                const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

                const x = radius * Math.cos(theta) * Math.sin(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(phi);

                const rotatedX = x * Math.cos(angleY) - z * Math.sin(angleY);
                const rotatedZ = z * Math.cos(angleY) + x * Math.sin(angleY);

                const finalX = rotatedX;
                const finalY = y * Math.cos(angleX) - rotatedZ * Math.sin(angleX);
                const finalZ = rotatedZ * Math.cos(angleX) + y * Math.sin(angleX);
                
                if (finalZ < (-fov)+3) {
                    img.style.display = 'none';
                } else {
                    img.style.display = 'block';
                }

                let scale = fov / (fov + finalZ);
                scale /= 5;

                img.style.transform = `translate(${finalX * scale}vw, ${finalY * scale}vh) scale(${scale*100}%)`;

                let sort = front ? -finalZ : (-finalZ) - fov;
                img.style.zIndex = Math.round(sort / zSimplicity);

                let opacity = (finalZ/(fov/2))+1;
                if (front) {
                    opacity = -finalZ/(fov/2);
                    opacity += 0.5;
                }

                img.style.opacity = Math.min(Math.max(opacity, 0), 1);
            };

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        document.addEventListener('mousemove', (event) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const deltaX = (event.clientX - centerX) / centerX;
            const deltaY = (event.clientY - centerY) / centerY;

            easingAngleY = deltaX * Math.PI / -5;
            easingAngleX = deltaY * Math.PI / -5;
        });