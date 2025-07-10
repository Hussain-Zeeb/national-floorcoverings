<?php
/**
 * Template part for displaying pinned sections
 * 
 * This template loops through all 'section' posts and displays them
 * in a pinned scroll format with content on left and featured image on right
 */

// Debug: Check if we're in the right context
// error_log('Sections template loaded');



if ($sections_query->have_posts()) : ?>
    <div class="pinned-sections-container sections-template">
        <?php 
        $section_count = 0;
        while ($sections_query->have_posts()) : 
            $sections_query->the_post();
            $section_count++;
            
            // Debug: Check current post
            // error_log('Processing section: ' . get_the_title() . ' (ID: ' . get_the_ID() . ')');
            
            // Get ACF fields
            $section_title = get_field('title');
            $section_description = get_field('description');
            $button_text = get_field('button_text');
            $button_url = get_field('button_url');
            
            // Debug ACF fields
            // error_log('ACF Title: ' . ($section_title ?: 'empty'));
            // error_log('ACF Description: ' . ($section_description ?: 'empty'));
            
            // Use ACF title if available, otherwise use post title
            $display_title = !empty($section_title) ? $section_title : get_the_title();
            
            // Determine layout (alternating)
            $reverse_class = ($section_count % 2 === 0) ? 'reverse' : '';
            ?>
            
            <div class="pinned-section <?php echo $reverse_class; ?>" data-section="<?php echo $section_count; ?>">

                    <div class="section-overlay"></div>
                    <!-- Section Number -->
                    <div class="section-number"><?php echo str_pad($section_count, 2, '0', STR_PAD_LEFT); ?></div>
                    
                    <!-- Content Panel -->
                    <div class="content-panel">
                        <div class="scroll-content">
                            <?php if ($display_title) : ?>
                                <h2 class="section-title"><?php echo esc_html($display_title); ?></h2>
                            <?php endif; ?>
                            
                            <?php if ($section_description) : ?>
                                <div class="section-description">
                                    <?php 
                                    // Handle different field types (WYSIWYG, textarea, text)
                                    if (is_array($section_description)) {
                                        echo wp_kses_post(implode(' ', $section_description));
                                    } else {
                                        echo wp_kses_post(wpautop($section_description));
                                    }
                                    ?>
                                </div>
                            <?php endif; ?>

                            <?php if ($button_text && $button_url) : ?>
                                <a class="section-btn" href="<?php echo esc_url($button_url); ?>">
                                    <?php echo esc_html($button_text); ?>
                                </a>
                            <?php endif; ?>


                            <?php
                            // Check for additional ACF fields that might be lists or features
                            $additional_fields = get_fields();
                            if ($additional_fields) :
                                foreach ($additional_fields as $field_name => $field_value) :
                                    if (in_array($field_name, ['title', 'description'])) continue; // Skip already displayed fields
                                    
                                    if (is_array($field_value) && !empty($field_value)) : ?>
                                        <div class="section-field section-<?php echo esc_attr($field_name); ?>">
                                            <?php if (isset($field_value[0]['feature_text'])) : // Repeater field ?>
                                                <ul class="features-list">
                                                    <?php foreach ($field_value as $item) : ?>
                                                        <li><?php echo esc_html($item['feature_text']); ?></li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            <?php elseif (is_array($field_value)) : // Simple array ?>
                                                <ul class="features-list">
                                                    <?php foreach ($field_value as $item) : ?>
                                                        <li><?php echo esc_html($item); ?></li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif;
                                endforeach;
                            endif; ?>
                            
                            <?php if (empty($display_title) && empty($section_description) && empty(get_the_content())) : ?>
                                <div class="debug-content">
                                    <p><strong>Debug Info:</strong></p>
                                    <p>Post Title: <?php echo get_the_title(); ?></p>
                                    <p>Post ID: <?php echo get_the_ID(); ?></p>
                                    <p>Post Type: <?php echo get_post_type(); ?></p>
                                    <p>ACF Fields: <?php echo function_exists('get_fields') ? 'Available' : 'Not Available'; ?></p>
                                    <?php if (function_exists('get_fields')) : ?>
                                        <p>All Fields: <?php var_dump(get_fields()); ?></p>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <!-- Image Panel -->
                    <div class="image-panel">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php 
                            $featured_image = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
                            $image_alt = get_post_meta(get_post_thumbnail_id(), '_wp_attachment_image_alt', true);
                            ?>
                            <div class="parallax-bg" style="background-image: url(<?php echo esc_url($featured_image[0]); ?>)"></div>
                        <?php else : ?>
                            <div class="no-image-placeholder">
                                <div class="placeholder-content">
                                    <span class="placeholder-icon">🖼️</span>
                                    <span class="placeholder-text">No featured image</span>
                                    <p><small>Post ID: <?php echo get_the_ID(); ?></small></p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
            </div>
            
        <?php endwhile; ?>
    </div>
    
    <?php 
    // Only reset if we created our own query
    if (isset($sections_query) && $sections_query !== $wp_query) {
        wp_reset_postdata();
    }
    ?>
    
<?php else : ?>
    <div class="no-sections-message">
        <div class="message-content">
            <h3>No sections found</h3>
            <p>Please add some sections in the WordPress admin.</p>
            <?php if (current_user_can('edit_posts')) : ?>
                <a href="<?php echo admin_url('post-new.php?post_type=section'); ?>" class="add-section-btn">
                    Add New Section
                </a>
            <?php endif; ?>
            
            <!-- Debug Information -->
            <div class="debug-info" style="margin-top: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px; font-size: 0.9rem;">
                <strong>Debug Info:</strong><br>
                Post Type 'section' registered: <?php echo post_type_exists('section') ? 'Yes' : 'No'; ?><br>
                ACF Available: <?php echo function_exists('get_field') ? 'Yes' : 'No'; ?><br>
                Current User Can Edit: <?php echo current_user_can('edit_posts') ? 'Yes' : 'No'; ?><br>
                Query Args: post_type=section, post_status=publish, posts_per_page=-1<br>
                <?php 
                $test_query = new WP_Query(array('post_type' => 'section', 'post_status' => 'publish'));
                echo 'Found Posts: ' . $test_query->found_posts;
                wp_reset_postdata();
                ?>
            </div>
        </div>
    </div>
<?php endif; ?>
